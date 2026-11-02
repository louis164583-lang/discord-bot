export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getAdminsCollection } from "@/lib/mongodb";
import AddBotForm from "@/components/AddBotForm";
import RemoveButton from "@/components/RemoveButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const col = await getAdminsCollection();
  const admins = await col.find({}, { projection: { _id: 0 } }).toArray();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Bot Dashboard</h1>
          <form action="/api/auth/signout" method="POST">
            <button className="text-sm text-gray-400 hover:text-white transition">
              Sign out
            </button>
          </form>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Add Bot</h2>
          <AddBotForm />
        </div>

        <div className="bg-gray-900 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Connected Bots ({admins.length})</h2>
          {admins.length === 0 ? (
            <p className="text-gray-500 text-sm">No bots added yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-left border-b border-gray-800">
                  <th className="pb-2">Username</th>
                  <th className="pb-2">Token</th>
                  <th className="pb-2">Alert Channel</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {admins.map((admin, i) => (
                  <tr key={i} className="py-2">
                    <td className="py-3 text-white font-medium">
                      {admin.username ?? "Unknown"}
                    </td>
                    <td className="py-3 font-mono text-gray-300">
                      {admin.adminToken.slice(0, 20)}***
                    </td>
                    <td className="py-3 text-gray-400">{admin.alertChannel}</td>
                    <td className="py-3">
                      {admin.owner ? (
                        <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                          Owner
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">Admin</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {!admin.owner && (
                        <RemoveButton token={admin.adminToken} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
