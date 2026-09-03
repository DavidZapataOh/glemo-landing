// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"api.mdx": () => import("../content/docs/api.mdx?collection=docs"), "index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "issue.mdx": () => import("../content/docs/issue.mdx?collection=docs"), "quickstart.mdx": () => import("../content/docs/quickstart.mdx?collection=docs"), "guides/webhooks.mdx": () => import("../content/docs/guides/webhooks.mdx?collection=docs"), "concepts/credentials.mdx": () => import("../content/docs/concepts/credentials.mdx?collection=docs"), "concepts/verification.mdx": () => import("../content/docs/concepts/verification.mdx?collection=docs"), }),
};
export default browserCollections;