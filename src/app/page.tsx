import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <section className="max-w-3xl text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Upload crop images. <span className="text-emerald-400">Chat with AI.</span>
          </h1>
          <p className="text-slate-300 text-lg">
            AgriLens AI helps you understand crop health by combining image insights
            and conversational AI. Login with Google, upload images, and ask anything.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/chat"
              className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
            >
              Start chatting
            </Link>
            <Link
              href="/auth/signin"
              className="px-6 py-3 rounded-lg border border-slate-700 hover:bg-slate-900 font-medium"
            >
              Login / Sign up
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
