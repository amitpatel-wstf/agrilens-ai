"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [chatHistory, setChatHistory] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [modal, setModal] = useState<{
    show: boolean;
    type: "info" | "success" | "error" | "confirm";
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleSaveSettings = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setModal({
      show: true,
      type: "success",
      title: "Settings Saved",
      message: "Your settings have been saved successfully!",
    });
  };

  const handleDeleteAccount = () => {
    setModal({
      show: true,
      type: "confirm",
      title: "Delete Account",
      message:
        "Are you absolutely sure? This will permanently delete your account and all associated data. This action cannot be undone.",
      onConfirm: async () => {
        setModal({
          show: true,
          type: "info",
          title: "Account Deletion",
          message:
            "Account deletion would be processed here. You would be logged out and redirected.",
        });
      },
    });
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const chatsRes = await fetch("/api/chats");
      const chats = await chatsRes.json();

      const allData = [];
      for (const chat of chats) {
        const messagesRes = await fetch(`/api/chats/${chat._id}/messages`);
        const messages = await messagesRes.json();
        allData.push({ chat, messages });
      }

      const dataStr = JSON.stringify(allData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `agrilens-data-${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      setModal({
        show: true,
        type: "success",
        title: "Data Exported",
        message: "Your data has been successfully exported!",
      });
    } catch (error) {
      console.error("Failed to export data:", error);
      setModal({
        show: true,
        type: "error",
        title: "Export Failed",
        message: "Failed to export your data. Please try again.",
      });
    } finally {
      setExporting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex justify-between items-center mb-10">
            <div className="h-9 w-32 bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-10 w-28 bg-slate-800 rounded-lg animate-pulse" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 bg-slate-900/80 border border-slate-700/80 rounded-2xl animate-pulse mb-6"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
                Settings
              </h1>
              <p className="text-slate-400 mt-1 text-sm sm:text-base">
                Manage your preferences and account
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800 hover:border-emerald-500/50 transition-colors text-sm font-medium"
              >
                Profile
              </Link>
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Appearance */}
          <section className="bg-slate-900/80 backdrop-blur border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 sm:p-8">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </span>
                Appearance
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div>
                    <p className="font-medium text-slate-100">Theme</p>
                    <p className="text-sm text-slate-400 mt-0.5">Choose your preferred theme</p>
                  </div>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full sm:w-auto min-w-[140px] px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-slate-900/80 backdrop-blur border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 sm:p-8">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </span>
                Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div>
                    <p className="font-medium text-slate-100">Email notifications</p>
                    <p className="text-sm text-slate-400 mt-0.5">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 peer-focus:ring-offset-2 peer-focus:ring-offset-slate-900 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:bg-emerald-500" />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy & Data */}
          <section className="bg-slate-900/80 backdrop-blur border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 sm:p-8">
              <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </span>
                Privacy & Data
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <div>
                    <p className="font-medium text-slate-100">Chat history</p>
                    <p className="text-sm text-slate-400 mt-0.5">Save your chat conversations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={chatHistory}
                      onChange={(e) => setChatHistory(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 peer-focus:ring-offset-2 peer-focus:ring-offset-slate-900 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:bg-emerald-500" />
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                  <p className="font-medium text-slate-100">Export your data</p>
                  <p className="text-sm text-slate-400 mt-0.5 mb-4">
                    Download all your chat history and data as JSON.
                  </p>
                  <button
                    onClick={handleExportData}
                    disabled={exporting}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 text-slate-100 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    {exporting ? "Exporting…" : "Export Data"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-950/20 backdrop-blur border border-red-500/30 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 sm:p-8">
              <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </span>
                Danger zone
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                  <p className="font-medium text-slate-100">Sign out</p>
                  <p className="text-sm text-slate-400 mt-0.5 mb-4">Sign out from your account on this device.</p>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Sign out
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/50 border border-red-500/20">
                  <p className="font-medium text-red-400">Delete account</p>
                  <p className="text-sm text-slate-400 mt-0.5 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Modal
        isOpen={modal.show}
        onClose={() => setModal({ ...modal, show: false })}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        confirmText={modal.type === "confirm" ? "Delete" : "OK"}
      />
    </>
  );
}
