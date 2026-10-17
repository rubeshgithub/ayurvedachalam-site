import { NextResponse, type NextRequest } from "next/server";

// architecture.md §5 route rules: lowercase, trailing slash (Next handles the slash via trailingSlash: true).
// Database redirects are resolved in the catch-all route; this only normalises case.
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (/[A-Z]/.test(pathname) && !pathname.startsWith("/_next") && !pathname.startsWith("/api")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|txt|xml|woff2?)$).*)"] };
