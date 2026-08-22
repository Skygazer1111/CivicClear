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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as
          | "citizen"
          | "official"
          | "admin";
      }
      return session;
    },
    authorized({ auth, request: { nextUrl, headers } }) {
      // Never intercept Server Action POSTs.
      if (headers.get("next-action")) {
        return true;
      }

      const isLoggedIn = Boolean(auth?.user);
      const role = auth?.user?.role;
      const path = nextUrl.pathname;

      const isCitizenArea =
        path.startsWith("/dashboard") ||
        path.startsWith("/profile") ||
        path.startsWith("/complaints");
      const isOfficialArea =
        path.startsWith("/queue") ||
        path.startsWith("/analytics");
      const isAdminArea = path.startsWith("/admin");

      if (isCitizenArea) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/login", nextUrl));
        }
        // If role is missing, do not bounce — avoid redirect loops.
        if (role && role !== "citizen") {
          return Response.redirect(
            new URL(role === "admin" ? "/admin" : "/queue", nextUrl),
          );
        }
        return true;
      }

      if (isAdminArea) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/login", nextUrl));
        }
        if (role && role !== "admin") {
          return Response.redirect(
            new URL(role === "citizen" ? "/dashboard" : "/queue", nextUrl),
          );
        }
        return true;
      }

      if (isOfficialArea) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/login", nextUrl));
        }
        if (role === "admin") {
          return Response.redirect(new URL("/admin", nextUrl));
        }
        if (role && role !== "official") {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
