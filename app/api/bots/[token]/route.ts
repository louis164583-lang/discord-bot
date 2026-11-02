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
