import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { getAdminsCollection } from "@/lib/mongodb";

function decodeTokenUserId(token: string): string | null {
  try {
    return Buffer.from(token.split(".")[0], "base64").toString("utf-8");
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const discordId = (profile as any)?.id;
      if (!discordId) return false;

      const col = await getAdminsCollection();
      const owners = await col.find({ owner: true }).toArray();

      const ownerIds = owners
        .map((o) => decodeTokenUserId(o.adminToken))
        .filter(Boolean);

      return ownerIds.includes(discordId);
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
};
