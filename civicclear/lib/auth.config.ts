import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const role = auth?.user?.role;
      const path = nextUrl.pathname;

      const isCitizenArea = path.startsWith("/dashboard") || path.startsWith("/profile");
      const isOfficialArea = path.startsWith("/queue") || path.startsWith("/map");
      const isAuthPage = path.startsWith("/login") || path.startsWith("/register");

      if (isCitizenArea) {
        if (!isLoggedIn) return false;
        if (role !== "citizen") {
          return Response.redirect(new URL("/queue", nextUrl));
        }
        return true;
      }

      if (isOfficialArea) {
        if (!isLoggedIn) return false;
        if (role !== "official" && role !== "admin") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      if (isAuthPage && isLoggedIn) {
        const home = role === "citizen" ? "/dashboard" : "/queue";
        return Response.redirect(new URL(home, nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
