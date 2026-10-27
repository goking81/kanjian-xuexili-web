import assert from "node:assert/strict";
import { readFile, readdir, access } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = (file) => readFile(new URL(file, root), "utf8");

test("README 准确描述产品分工、费用、流程且本地链接可用", async () => {
  const markdown = await read("README.md");
  for (const text of ["本仓库不包含小程序源码或支付后端", "20 题", "40 题", "29.90", "不设自动到期", "不承诺永久查看", "理解力", "抗挫力"]) assert.ok(markdown.includes(text));
  assert.doesNotMatch(markdown, /阅读时长、专注片段、提问质量|content\/\s+文章与内容/);
  for (const [, target] of markdown.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    if (!target.startsWith("https://")) await access(new URL(target, root));
  }
});

test("首页、报告页与搜索结构化数据区分免费和单次付费报告", async () => {
  const home = await read("dist/index.html");
  assert.doesNotMatch(home, /class="hero-note"/);
  assert.doesNotMatch(home, /测评与基础报告免费 · 完整报告按需购买/);
  const schemas = JSON.parse(home.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const app = schemas.find((schema) => schema["@type"] === "SoftwareApplication");
  assert.deepEqual(app.offers.map(({ price }) => price), ["0", "29.90"]);
  for (const file of ["dist/index.html", "dist/report/index.html"]) {
    const html = await read(file);
    for (const text of ["29.90", "Android", "iOS", "网站不收款", "不自动续费", "不设自动到期", "不承诺永久查看", "不包含 PDF", "不编造、不补足", "我的订单"]) {
      assert.ok(html.includes(text), `${file} 缺少 ${text}`);
    }
    assert.ok(html.includes("驱动力、行动力、理解力、抗挫力、环境力和潜能力"));
    assert.doesNotMatch(html, /认知力|>韧性</);
    assert.match(html, /<a class="card-link" href="\/faq\/#purchase-support">查看订单与售后说明<\/a>/);
  }
  const process = await read("dist/how-it-works/index.html");
  for (const name of ["驱动力", "行动力", "理解力", "抗挫力", "环境力", "潜能力"]) assert.ok(process.includes(name));
  assert.doesNotMatch(process, /认知力|>韧性</);
  assert.ok((await read("public/llms.txt")).includes("29.90"));
});

test("售后 FAQ 的可见文本与结构化数据保持一致", async () => {
  const html = await read("dist/faq/index.html");
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  for (const item of schema.mainEntity) {
    assert.ok(html.includes(`<summary>${item.name}</summary>`));
    assert.ok(html.includes(`<p>${item.acceptedAnswer.text}</p>`));
  }
  for (const text of ["确认购买结果", "请勿重复付款", "退款后", "App Store", "人工核对", "确认无法交付时全额退款", "暂不开放"]) assert.ok(html.includes(text));
});

test("404 页面不参与索引且规范链接指向实际构建文件", async () => {
  const html = await read("dist/404.html");
  assert.match(html, /name="robots" content="noindex,follow"/);
  assert.match(html, /rel="canonical" href="https:\/\/dna\.learnbox\.cc\/404\.html"/);
});

test("构建页面的站内链接、片段与图片资源存在", async () => {
  const files = await readdir(new URL("dist/", root), { recursive: true });
  const htmlFiles = files.filter((file) => file.endsWith(".html"));
  assert.ok(htmlFiles.length >= 10);
  for (const file of htmlFiles) {
    const html = await read(`dist/${file.replaceAll(path.sep, "/")}`);
    const base = new URL(file.replaceAll(path.sep, "/").replace(/index\.html$/, ""), "https://dna.learnbox.cc/");
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const target = new URL(raw, base);
      if (target.origin !== base.origin) continue;
      const pathname = decodeURIComponent(target.pathname);
      const resource = `dist${pathname.endsWith("/") ? `${pathname}index.html` : pathname}`;
      await access(new URL(resource, root));
      if (target.hash && resource.endsWith(".html")) {
        const body = await read(resource);
        assert.ok(body.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `${file}: ${raw}`);
      }
    }
  }
});

for (const outcome of ["success", "denied", "unavailable"]) {
  test(`小程序入口与名称复制：${outcome}`, async () => {
    const source = await read("src/components/MiniProgramDialog.astro");
    const script = source.match(/<script>([\s\S]*?)<\/script>/)[1];
    class Button {
      dataset = { name: "看见学习力" };
      textContent = "复制名称";
      handlers = {};
      addEventListener(name, handler) { this.handlers[name] = handler; }
    }
    const status = { textContent: "" };
    class Dialog {
      open = false;
      showModal() { this.open = true; }
      close() { this.open = false; }
      querySelector() { return status; }
    }
    const dialog = new Dialog();
    const open = new Button();
    const close = new Button();
    const copy = new Button();
    const copied = [];
    vm.runInNewContext(script, {
      HTMLDialogElement: Dialog,
      HTMLButtonElement: Button,
      document: {
        querySelector: () => dialog,
        querySelectorAll: (selector) => [{ ".js-open-mini": open, ".js-close-mini": close, ".js-copy-name": copy }[selector]],
      },
      navigator: outcome === "unavailable" ? {} : {
        clipboard: { writeText: async (text) => {
          if (outcome === "denied") throw new Error("NotAllowedError");
          copied.push(text);
        } },
      },
    });
    open.handlers.click();
    assert.equal(dialog.open, true);
    close.handlers.click();
    assert.equal(dialog.open, false);
    await copy.handlers.click();
    assert.equal(copy.textContent, outcome === "success" ? "已复制" : "复制名称");
    assert.match(status.textContent, outcome === "success" ? /名称已复制/ : /未能复制/);
    assert.deepEqual(copied, outcome === "success" ? ["看见学习力"] : []);
  });
}
