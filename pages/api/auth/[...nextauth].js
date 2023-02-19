// https://reacthustle.com/blog/nextjs-redirect-after-login
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";

import { supabase } from "./../../../lib/supabaseClient";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "please provide process.env.NEXTAUTH_SECRET environment variable"
  );
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      id: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const { data: users, error } = await supabase
          .from("users")
          .select("*")
          .eq("username", credentials.email);
        const user = users[0];

        if (
          credentials?.email !== user.username ||
          credentials.password !== user.password ||
          error
        ) {
          throw new Error("Invalid email or password");
        }
        return {
          username: user.username,
          name: user.name,
          id: user.id,
          isTest: user.test,
          isAdmin: user.admin,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // https://github.com/nextauthjs/next-auth/discussions/2762
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});
