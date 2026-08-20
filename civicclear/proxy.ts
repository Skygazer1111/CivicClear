import NextAuth from "next-auth";
import { authConfig } from "@/features/auth/auth.config";

const { auth } = NextAuth(authConfig);

export { auth as proxy };

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/complaints/:path*",
    "/queue/:path*",
    "/map/:path*",
  ],
};
