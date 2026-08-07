// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
var docs = defineDocs({ dir: "content/docs" });
var source_config_default = defineConfig({
  mdxOptions: {
    // Both slots carry the same theme on purpose: the docs render on the dark ink
    // canvas in either colour scheme, so a light variant would be a bright block in
    // the middle of the page. v16 replaced the single `theme` key with this pair and
    // falls back to github-light/dark when it is absent, which is not bundled and
    // fails the build rather than degrading.
    rehypeCodeOptions: {
      themes: { light: "poimandres", dark: "poimandres" }
    }
  }
});
export {
  source_config_default as default,
  docs
};
