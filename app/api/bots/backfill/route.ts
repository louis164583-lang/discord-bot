import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminsCollection } from "@/lib/mongodb";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const col = await getAdminsCollection();
  const bots = await col.find({ $or: [{ username: { $in: [null, undefined] } }, { username: "Unknown" }] }).toArray();

  let updated = 0;
  const results = [];
  for (const bot of bots) {
    try {
      const res = await fetch("https://discord.com/api/v10/users/@me", {
        headers: { Authorization: bot.adminToken },
      });
      const body = await res.json();
      if (res.ok && body.username) {
        await col.updateOne({ adminToken: bot.adminToken }, { $set: { username: body.username } });
        updated++;
        results.push({ status: res.status, username: body.username });
      } else {
        results.push({ status: res.status, error: body });
      }
    } catch (e: unknown) {
      results.push({ error: String(e) });
    }
  }

  return NextResponse.json({ total: bots.length, updated, results });
}
