import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const isSpecifiedLINEUser = (token: { sub?: string } | null) => 
    token?.sub === process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER1 ||
    token?.sub === process.env.NEXT_PUBLIC_SPECIFIEDLINEUSER2

  

export default withAuth(
  async function middleware(req) {
    const isAuthPage = req.nextUrl.pathname.startsWith("/signIn");
    if (isAuthPage && isSpecifiedLINEUser(req.nextauth.token)) {
      return NextResponse.redirect(new URL("/home/register-receipt", req.url));
    }
    return null;
  },
  {
    pages: {
      signIn: "/signIn",
    },
    callbacks: {
      async authorized({ token }) {
        return !!token && isSpecifiedLINEUser(token);
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: ["/", "/home/:path*", "/signIn"],
};
