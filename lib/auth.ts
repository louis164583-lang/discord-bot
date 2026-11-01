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
      try {
        const discordId = (profile as any)?.id;
        if (!discordId) {
          console.error("[signIn] No Discord ID in profile");
          return false;
        }

        const col = await getAdminsCollection();
        const owners = await col.find({ owner: true }).toArray();
        console.log(`[signIn] Discord ID: ${discordId}, owners found: ${owners.length}`);

        const ownerIds = owners
          .map((o) => decodeTokenUserId(o.adminToken))
          .filter(Boolean);
        console.log(`[signIn] Decoded owner IDs:`, ownerIds);

        return ownerIds.includes(discordId);
      } catch (err) {
        console.error("[signIn] Error:", err);
        return false;
      }
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
