import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export const proxy = NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/queue/:path*",
    "/map/:path*",
    "/login",
    "/register",
  ],
};
