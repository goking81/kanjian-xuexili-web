import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://dna.learnbox.cc",
  output: "static",
  integrations: [sitemap()],
  build: {
    format: "directory"
  }
});
