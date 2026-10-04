import { NextAuthOptions } from "next-auth";
import LineProvider from "next-auth/providers/line";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  useSecureCookies: process.env.NODE_ENV === "production",
  providers: [
    LineProvider({
      clientId: process.env.LINE_CHANNEL_ID!,
      clientSecret: process.env.LINE_CHANNEL_SECRET!,
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
    }),
  ],
  pages: {
    signIn: "/signIn",
  },
  callbacks: {
    // async jwt({ token, profile }) {
    //   // Persist the OAuth access_token and or the user id to the token right after signin
    //   // console.log("token");
    //   // console.log(token);
    //   // console.log(`account`);
    //   // console.log(account);
    //   // console.log(`profile`);
    //   // console.log(profile);
    //   // if (profile) {
    //   //   token.id = profile.sub;
    //   // }
    //   // console.log(token);
    //   return token;
    // },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
