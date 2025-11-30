"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";

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
      <>
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!session) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-72px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold mb-8">Profile</h1>
          
          {/* Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg shadow-emerald-500/20">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-3xl">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-semibold">{session.user?.name}</h2>
                <p className="text-slate-400 mt-1">{session.user?.email}</p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  Active
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <label className="text-sm text-slate-400">Full Name</label>
                  <p className="text-slate-200 font-medium mt-1">{session.user?.name}</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <label className="text-sm text-slate-400">Email Address</label>
                  <p className="text-slate-200 font-medium mt-1">{session.user?.email}</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <label className="text-sm text-slate-400">Account Type</label>
                  <p className="text-slate-200 font-medium mt-1">Google Account</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <label className="text-sm text-slate-400">Member Since</label>
                  <p className="text-slate-200 font-medium mt-1">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
            <h3 className="text-lg font-semibold mb-6">Usage Statistics</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="text-4xl font-bold text-emerald-400">{stats.totalChats}</div>
                <p className="text-slate-400 mt-2">Total Chats</p>
              </div>
              <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="text-4xl font-bold text-emerald-400">{stats.totalMessages}</div>
                <p className="text-slate-400 mt-2">Messages Sent</p>
              </div>
              <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="text-4xl font-bold text-emerald-400">
                  {stats.totalChats > 0 ? Math.round(stats.totalMessages / stats.totalChats) : 0}
                </div>
                <p className="text-slate-400 mt-2">Avg per Chat</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push('/chat')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition-all"
              >
                Start New Chat
              </button>
              <button
                onClick={() => router.push('/settings')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-medium transition-all"
              >
                Account Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
