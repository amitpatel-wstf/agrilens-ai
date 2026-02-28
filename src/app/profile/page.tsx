"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ totalChats: 0, totalMessages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchStats();
    }
  }, [status, router]);

  const fetchStats = async () => {
    try {
      const chatsRes = await fetch("/api/chats");
      const chats = await chatsRes.json();

      let messageCount = 0;
      for (const chat of chats) {
        const messagesRes = await fetch(`/api/chats/${chat._id}/messages`);
        const messages = await messagesRes.json();
        messageCount += messages.length;
      }

      setStats({ totalChats: chats.length, totalMessages: messageCount });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="h-9 w-48 bg-slate-800 rounded-lg animate-pulse mb-10" />
          <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-slate-700 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="h-6 w-40 bg-slate-700 rounded animate-pulse mx-auto sm:mx-0" />
                <div className="h-4 w-56 bg-slate-800 rounded animate-pulse mx-auto sm:mx-0" />
              </div>
            </div>
            <div className="border-t border-slate-700/80 pt-6 grid sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-slate-800/50 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-900/80 border border-slate-700/80 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const avgPerChat = stats.totalChats > 0 ? Math.round(stats.totalMessages / stats.totalChats) : 0;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
              Profile
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Your account and usage at a glance
            </p>
          </div>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800 hover:border-emerald-500/50 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Back to Chat
          </Link>
        </div>

        {/* Profile card */}
        <section className="bg-slate-900/80 backdrop-blur border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-2 ring-slate-700/50">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-3xl sm:text-4xl">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
                </span>
              </div>
              <div className="flex-1 text-center sm:text-left min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 truncate">
                  {session.user?.name}
                </h2>
                <p className="text-slate-300 text-sm sm:text-base mt-1 truncate">
                  {session.user?.email}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  Active
                </div>
              </div>
            </div>

            <div className="border-t border-slate-700/80 mt-8 pt-8">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Account information
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Full name", value: session.user?.name },
                  { label: "Email address", value: session.user?.email },
                  { label: "Account type", value: "Google Account" },
                  { label: "Status", value: "Active member" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                  >
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-slate-100 font-medium mt-1 truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Usage statistics */}
        <section className="bg-slate-900/80 backdrop-blur border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 sm:p-8">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Usage statistics
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-5 sm:p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center hover:border-emerald-500/30 transition-colors">
                <p className="text-3xl sm:text-4xl font-bold text-emerald-400 tabular-nums">
                  {stats.totalChats}
                </p>
                <p className="text-slate-400 text-sm font-medium mt-2">Total chats</p>
              </div>
              <div className="p-5 sm:p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center hover:border-emerald-500/30 transition-colors">
                <p className="text-3xl sm:text-4xl font-bold text-emerald-400 tabular-nums">
                  {stats.totalMessages}
                </p>
                <p className="text-slate-400 text-sm font-medium mt-2">Messages sent</p>
              </div>
              <div className="p-5 sm:p-6 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center hover:border-emerald-500/30 transition-colors">
                <p className="text-3xl sm:text-4xl font-bold text-emerald-400 tabular-nums">
                  {avgPerChat}
                </p>
                <p className="text-slate-400 text-sm font-medium mt-2">Avg. per chat</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="bg-slate-900/80 backdrop-blur border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 sm:p-8">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start new chat
              </Link>
              <Link
                href="/settings"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-medium text-sm transition-all hover:border-slate-500"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Account settings
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
