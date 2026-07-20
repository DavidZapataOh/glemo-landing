import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({ dir: "content/docs" });

export default defineConfig({
  mdxOptions: {
    // Syntax highlighting acorde a la marca (teal/verde sobre tinta oscura)
    rehypeCodeOptions: { theme: "poimandres" },
  },
});
