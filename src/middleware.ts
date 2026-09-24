import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge redirects that used to live in nginx (deploy/nginx.conf) and can't be
 * set as Cloudflare zone rules with the current OAuth token (zone:read only):
 *
 *  1. www → apex (301), path + query preserved
 *  2. HTTP → HTTPS (301), except /<digits>.txt which eNamad crawls over
 *     plain HTTP and does not follow redirects for (same exception as nginx)
 *
 * Runs on Workers via OpenNext; VPS keeps nginx doing this (no CF_RUNTIME
 * gate needed — behavior is identical on both).
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = (request.headers.get("host") ?? url.hostname).toLowerCase();

  if (host.startsWith("www.")) {
    const apex = url.clone();
    apex.hostname = host.slice(4);
    apex.protocol = "https:";
    return NextResponse.redirect(apex, 301);
  }

  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    url.protocol.replace(":", "");
  if (proto === "http" && !/^\/[0-9]+\.txt$/.test(url.pathname)) {
    const secure = url.clone();
    secure.protocol = "https:";
    return NextResponse.redirect(secure, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
