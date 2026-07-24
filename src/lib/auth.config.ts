import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute =
        request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/projects") ||
        request.nextUrl.pathname.startsWith("/settings");

      if (isProtectedRoute && !isLoggedIn) {
        return false;
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;