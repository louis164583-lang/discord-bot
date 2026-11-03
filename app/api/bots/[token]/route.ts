import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminsCollection } from "@/lib/mongodb";
import { exec } from "child_process";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token } = await params;
  const col = await getAdminsCollection();
  const admin = await col.findOne({ adminToken: token });

  if (!admin) {
    return NextResponse.json({ error: "Bot not found." }, { status: 404 });
  }

  if (admin.owner === true) {
    return NextResponse.json({ error: "Cannot remove the owner bot." }, { status: 403 });
  }

  await col.deleteOne({ adminToken: token });

  if (admin.pm2Name) {
    exec(`pm2 stop ${admin.pm2Name}`);
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { token } = await params;
  const { newToken } = await req.json();

  if (!newToken) return NextResponse.json({ error: "New token required." }, { status: 400 });

  const col = await getAdminsCollection();
  const admin = await col.findOne({ adminToken: token });
  if (!admin) return NextResponse.json({ error: "Bot not found." }, { status: 404 });

  let username = admin.username ?? "Unknown";
  try {
    const res = await fetch("https://discord.com/api/v10/users/@me", {
      headers: { Authorization: newToken },
    });
    if (res.ok) {
      const user = await res.json();
      username = user.username;
    }
  } catch {}

  await col.updateOne(
    { adminToken: token },
    { $set: { adminToken: newToken, username, status: "offline" } }
  );

  return NextResponse.json({ success: true });
}
