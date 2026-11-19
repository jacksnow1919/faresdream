// Imported statically: importing this lazily makes the bundler create a circular pair of
// server chunks that load in the wrong order, and every request then fails with a 500.
import serverEntry from "@tanstack/react-start/server-entry";

import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { isNoindexPath } from "./lib/seo";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

const handler = serverEntry as unknown as ServerEntry;

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/** HSTS on the live domain, and noindex for search results, checkout, sign-in and admin. */
function withSeoHeaders(response: Response, url: URL): Response {
  const isLive = url.hostname.endsWith("faresdream.com");
  const noindex = isNoindexPath(url.pathname);
  if (!isLive && !noindex) return response;
  const out = new Response(response.body, response);
  if (isLive) out.headers.set("Strict-Transport-Security", "max-age=31536000");
  if (noindex) out.headers.set("X-Robots-Tag", "noindex, follow");
  return out;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    // The site lives on www; 308 keeps POST requests intact.
    const url = new URL(request.url);
    if (url.hostname === "faresdream.com") {
      url.hostname = "www.faresdream.com";
      url.protocol = "https:";
      return Response.redirect(url.toString(), 308);
    }

    // Force HTTPS on the live domain (plain http used to serve the full site with a 200).
    if (url.protocol === "http:" && url.hostname.endsWith("faresdream.com")) {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    try {
      const response = await handler.fetch(request, env, ctx);
      return withSeoHeaders(await normalizeCatastrophicSsrResponse(response), url);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
