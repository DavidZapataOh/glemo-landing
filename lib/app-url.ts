const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.glemo.io";

/** Every landing CTA that enters the product goes through here, so the
 *  destination is one env var away in every environment. */
export function appUrl(path = "/"): string {
  const base = APP_URL.replace(/\/+$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
