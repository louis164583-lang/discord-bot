import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { exec } from "child_process";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return new Promise<NextResponse>((resolve) => {
    exec("pm2 restart member-alert-bot", (err) => {
      if (err) {
        resolve(NextResponse.json({ error: "Failed to restart bot" }, { status: 500 }));
      } else {
        resolve(NextResponse.json({ success: true }));
      }
    });
  });
}
