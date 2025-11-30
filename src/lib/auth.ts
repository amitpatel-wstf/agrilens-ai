import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./mongodb";
import { User } from "./models/User";


export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;
      await connectDB();
      const existing = await User.findOne({ email: user.email });

      if (!existing) {
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
          providerId: account?.providerAccountId,
          credits: 100,
        });
      }
      return true;
    },
    async session({ session }) {
      // Attach DB user info to session
      if (session.user?.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user.email }).lean();
        if (dbUser && !Array.isArray(dbUser)) {
          (session as any).userId = dbUser._id?.toString();
          (session as any).credits = (dbUser as any).credits;
        }
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
};
