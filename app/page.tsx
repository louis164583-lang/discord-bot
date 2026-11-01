export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg p-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold">Bot Dashboard</h1>
        <LoginForm />
      </div>
    </div>
  );
}
