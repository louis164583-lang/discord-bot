export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg p-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold">Bot Dashboard</h1>
        <p className="text-gray-400 text-sm text-center">
          Sign in with your Discord account to manage bots.
        </p>
        <a
          href="/api/auth/signin"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded px-6 py-2.5 transition w-full text-center"
        >
          Sign in with Discord
        </a>
      </div>
    </div>
  );
}
