# 搜索收录与内容运营清单

更新时间：2026-09-01

## 当前已完成

- 正式站点：`https://dna.learnbox.cc/`
- GitHub 仓库：`https://github.com/goking81/kanjian-xuexili-web`
- Cloudflare Pages 已连接 `main` 分支；每次推送会自动构建发布。
- 已发布 `robots.txt`、`sitemap-index.xml`、结构化数据、规范链接和 `llms.txt`。
- 小程序入口已使用官方“搜一搜”推广物料。

## 第一天：提交收录

### 百度搜索资源平台

1. 使用主体对应的百度账号登录“百度搜索资源平台”。
2. 添加站点 `https://dna.learnbox.cc`，选择 HTTPS 站点。
3. 优先使用 DNS 验证；在 Cloudflare 的 `learnbox.cc` 域名下按百度给出的记录创建验证记录。
4. 验证通过后，提交站点地图：`https://dna.learnbox.cc/sitemap-index.xml`。
5. 在“普通收录”中提交以下首批页面：
   - `/`
   - `/report/`
   - `/how-it-works/`
   - `/guides/`
   - `/guides/homework-procrastination/`
   - `/guides/learning-motivation/`
   - `/guides/parent-child-gap/`
   - `/faq/`

### Bing Webmaster Tools

1. 添加 `https://dna.learnbox.cc`。
2. 以 DNS 记录验证域名所有权。
3. 提交相同的站点地图地址。

Google Search Console 可以同步接入，但国内增长优先级低于百度。

## 每周固定动作

- 发布 1 篇只解决一个家长问题的原创指南，先服务真实咨询，再优化标题和摘要。
- 检查百度的收录量、抓取错误和核心页面索引状态。
- 记录每篇文章的展现、点击、搜索词和小程序入口点击，保留有效主题，停止没有真实阅读的主题。
- 对表现好的文章补充具体场景、家长原话、可执行的小步骤和相关文章链接。

## 内容质量边界

- 不买垃圾外链，不批量发无关论坛评论，不用伪造家长案例。
- 不把“厌学”“焦虑”等高风险词写成诊断或承诺治疗的广告语。
- 每篇文章明确：这是什么情况、可先观察什么、家长今天能做什么、何时应寻求专业支持。
- 文章的主入口保持为“在微信中打开看见学习力”，不承诺测评能替代专业诊疗或教育决策。

## 发布前检查

- 页面标题与 H1 指向同一个具体问题。
- 页面有描述性摘要、规范链接和至少两个相关内链。
- 手机端正文、图片、按钮没有横向溢出。
- 小程序码可被真实微信扫码识别。
- 新文章加入页面导航或指南列表，保证爬虫与读者都能进入。
