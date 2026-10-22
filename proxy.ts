import { NextResponse, type NextRequest } from "next/server";

// architecture.md §5 route rules: lowercase, trailing slash (Next handles the slash via trailingSlash: true).
// Database redirects are resolved in the catch-all route; this only normalises case.
function stagingGate(req: NextRequest): NextResponse | null {
  // architecture.md §11: staging sits behind a password. Set STAGING_PASSWORD only on staging.
  const pw = process.env.STAGING_PASSWORD;
  if (!pw) return null;
  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    try {
      const [, pass] = atob(header.slice(6)).split(":");
      if (pass === pw) return null;
    } catch { /* fall through */ }
  }
  return new NextResponse("Staging — password required", { status: 401, headers: { "www-authenticate": 'Basic realm="Ayurvedachalam staging"' } });
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/api/cms/ingest") && !pathname.startsWith("/api/cron/")) { const gate = stagingGate(req); if (gate) return gate; }
  if (/[A-Z]/.test(pathname) && !pathname.startsWith("/_next") && !pathname.startsWith("/api")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|txt|xml|woff2?)$).*)"] };
