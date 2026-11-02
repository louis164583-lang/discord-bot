import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminsCollection } from "@/lib/mongodb";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const col = await getAdminsCollection();
  const admins = await col.find({}, { projection: { _id: 0 } }).toArray();

  const masked = admins.map((a) => ({
    ...a,
    adminToken: a.adminToken.slice(0, 20) + "***",
  }));

  return NextResponse.json(masked);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { adminToken, alertChannel } = await req.json();

  if (!adminToken || !alertChannel) {
    return NextResponse.json({ error: "Token and channel ID are required." }, { status: 400 });
  }

  const col = await getAdminsCollection();
  const exists = await col.findOne({ adminToken });
  if (exists) {
    return NextResponse.json({ error: "Token already exists." }, { status: 409 });
  }

  let username = "Unknown";
  try {
    const discordRes = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: `Bot ${adminToken}` },
    });
    if (discordRes.ok) {
      const user = await discordRes.json();
      username = user.username;
    }
  } catch {}

  await col.insertOne({ adminToken, alertChannel, owner: false, username });
  return NextResponse.json({ success: true }, { status: 201 });
}
