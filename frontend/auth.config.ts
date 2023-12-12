import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname.startsWith("/login");
      if (isOnLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/vault", nextUrl));
      }

      const isOnDashboard = nextUrl.pathname.startsWith("/vault");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return true;
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
