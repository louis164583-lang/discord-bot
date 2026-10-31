import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminsCollection } from "@/lib/mongodb";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const col = await getAdminsCollection();
  const admin = await col.findOne({ adminToken: params.token });

  if (!admin) {
    return NextResponse.json({ error: "Bot not found." }, { status: 404 });
  }

  if (admin.owner === true) {
    return NextResponse.json({ error: "Cannot remove the owner bot." }, { status: 403 });
  }

  await col.deleteOne({ adminToken: params.token });
  return NextResponse.json({ success: true });
}
