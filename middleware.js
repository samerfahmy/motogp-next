import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const protectedPaths = ["/", "/admin", "/scores", "/calendar", "/predict"];
  const isPathProtected = protectedPaths?.some((path) => pathname == path);
  const isProtectedApi = pathname.startsWith('/api') && !pathname.startsWith('/api/auth');
  const res = NextResponse.next();

  if (isPathProtected || isProtectedApi) {
    const token = await getToken({ req });
    if (!token) {
      if (isProtectedApi) {
        return new NextResponse(
          JSON.stringify({ success: false, message: 'authentication failed' }),
          { status: 401, headers: { 'content-type': 'application/json' } }
        )
      }

      const url = new URL(`/login`, req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname === '/') {
    const url = new URL(`/predict`, req.url);
    return NextResponse.redirect(url)   
  }

  return res;
}