// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config/zod-3";
var docs = defineDocs({ dir: "content/docs" });
var source_config_default = defineConfig({
  mdxOptions: {
    // Syntax highlighting acorde a la marca (teal/verde sobre tinta oscura)
    rehypeCodeOptions: { theme: "poimandres" }
  }
});
export {
  source_config_default as default,
  docs
};
