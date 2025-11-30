"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-center">Welcome to AgriLens AI</h2>
        <p className="text-slate-400 text-sm text-center">
          Sign in with Google to start chatting with the AI assistant.
        </p>
        <button
          onClick={() => signIn("google")}
          className="w-full py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}
