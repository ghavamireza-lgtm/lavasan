// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");


  if (isDashboard && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const isAuthPage = 
  request.nextUrl.pathname === "/sign-in" ||
  request.nextUrl.pathname === "/sign-up";

  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};