export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getAdminsCollection } from "@/lib/mongodb";
import AddBotForm from "@/components/AddBotForm";
import RemoveButton from "@/components/RemoveButton";
import BackfillButton from "@/components/BackfillButton";
import RestartButton from "@/components/RestartButton";
import AutoRefresh from "@/components/AutoRefresh";
import ViewTokenButton from "@/components/ViewTokenButton";
import EditTokenForm from "@/components/EditTokenForm";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const col = await getAdminsCollection();
  const admins = await col.find({}, { projection: { _id: 0 } }).toArray();

  const onlineCount = admins.filter((a) => a.status === "online").length;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Bot Dashboard</h1>
          <form action="/api/auth/signout" method="POST">
            <button className="text-sm text-gray-400 hover:text-white transition">
              Sign out
            </button>
          </form>
        </div>

        {/* Status bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col gap-1">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Total Bots</span>
            <span className="text-2xl font-bold">{admins.length}</span>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col gap-1">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Online</span>
            <span className="text-2xl font-bold text-green-400">{onlineCount}</span>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 flex flex-col gap-1">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Offline</span>
            <span className="text-2xl font-bold text-red-400">{admins.length - onlineCount}</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold">Add Bot</h2>
          <AddBotForm />
        </div>

        <div className="bg-gray-900 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">Bots</h2>
              <AutoRefresh intervalSeconds={30} />
            </div>
            <div className="flex items-center gap-3">
              <BackfillButton />
              <RestartButton />
            </div>
          </div>

          {admins.length === 0 ? (
            <p className="text-gray-500 text-sm">No bots added yet.</p>
          ) : (
            <div className="space-y-3">
              {admins.map((admin, i) => {
                const isOnline = admin.status === "online";
                const isOffline = admin.status === "offline";
                return (
                  <div
                    key={i}
                    className={`rounded-lg border p-4 transition-colors ${
                      isOnline
                        ? "border-green-900 bg-green-950/20"
                        : isOffline
                        ? "border-red-900 bg-red-950/20"
                        : "border-gray-800 bg-gray-900/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-3">
                        {/* Status dot */}
                        <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                          {isOnline && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-40" />
                          )}
                          <span
                            className={`relative inline-flex rounded-full w-2.5 h-2.5 ${
                              isOnline ? "bg-green-500" : isOffline ? "bg-red-500" : "bg-gray-600"
                            }`}
                          />
                        </div>

                        {/* Username + role */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">
                              {admin.username ?? "Unknown"}
                            </span>
                            {admin.owner ? (
                              <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                                Owner
                              </span>
                            ) : (
                              <span className="text-gray-600 text-xs">Admin</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Channel: {admin.alertChannel}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <EditTokenForm currentToken={admin.adminToken} />
                        {!admin.owner && (
                          <RemoveButton token={admin.adminToken} />
                        )}
                      </div>
                    </div>

                    {/* Token row */}
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <ViewTokenButton token={admin.adminToken} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
