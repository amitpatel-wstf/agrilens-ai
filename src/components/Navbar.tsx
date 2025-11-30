"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <Link href="/" className="font-semibold text-lg">
        AgriLens AI
      </Link>

      <div className="flex items-center gap-4">
        {session?.user ? (
          <>
            <span className="hidden sm:block text-sm text-slate-300">
              {session.user.name}
            </span>
            <button
              onClick={() => (window.location.href = "/chat")}
              className="px-3 py-1 text-sm rounded-md border border-slate-700 hover:bg-slate-800"
            >
              Open Chat
            </button>
            <button
              onClick={() => signOut()}
              className="px-3 py-1 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="px-4 py-2 text-sm rounded-md bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
}
