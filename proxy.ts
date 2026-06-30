import { NextResponse, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const role = req.cookies.get("prime.role")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && role !== "admin") {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
