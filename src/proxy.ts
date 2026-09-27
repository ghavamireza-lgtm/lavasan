// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isProtected = request.nextUrl.pathname.startsWith("/dashboard");

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};