"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-20 md:py-28 lg:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 text-center md:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-100 animate-fade-in">
                Your AI-Powered{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  Crop Health
                </span>{" "}
                Assistant
              </h1>

              <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto md:mx-0 animate-fade-in-delay leading-relaxed">
                Get instant expert advice on crop diseases, pests, soil health, and farm management.
                Powered by advanced AI technology.
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start animate-fade-in-delay-2">
                {status === "loading" ? (
                  <div className="h-14 w-40 rounded-xl bg-slate-800 animate-pulse" />
                ) : session ? (
                  <Link
                    href="/chat"
                    className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base sm:text-lg transition-all hover:shadow-lg hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Start Chatting
                    <span className="inline-block group-hover:translate-x-0.5 transition-transform" aria-hidden>→</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base sm:text-lg transition-all hover:shadow-lg hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                      Get Started
                      <span className="inline-block group-hover:translate-x-0.5 transition-transform" aria-hidden>→</span>
                    </Link>
                    <Link
                      href="/auth/signin"
                      className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-slate-600 text-slate-200 hover:border-emerald-500 hover:bg-slate-800/80 font-semibold text-base sm:text-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="relative animate-fade-in-delay-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-slate-700/80 bg-slate-900/80">
                <Image
                  src="/landing_pic.png"
                  alt="AgriLens AI - Crop Health Analysis"
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
              </div>
              <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-emerald-500/15 to-green-500/15 blur-2xl rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-14 sm:py-16 md:py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100 text-center mb-4">
          How AgriLens AI Helps You
        </h2>
        <p className="text-slate-400 text-center max-w-2xl mx-auto mb-12 md:mb-14">
          Built for farmers and growers who need fast, reliable answers.
        </p>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <article className="group p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-700/80 hover:border-emerald-500/40 transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="text-xl font-semibold text-slate-100">Disease Detection</h3>
            </div>
            <p className="text-slate-400 text-base leading-relaxed">
              Identify crop diseases, pests, and nutrient deficiencies with AI-powered analysis and get actionable treatment recommendations.
            </p>
          </article>

          <article className="group p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-700/80 hover:border-emerald-500/40 transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </span>
              <h3 className="text-xl font-semibold text-slate-100">Expert Guidance</h3>
            </div>
            <p className="text-slate-400 text-base leading-relaxed">
              Get practical, step-by-step advice on soil health, irrigation, fertilization, and integrated pest management strategies.
            </p>
          </article>

          <article className="group p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-700/80 hover:border-emerald-500/40 transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
              <h3 className="text-xl font-semibold text-slate-100">Instant Answers</h3>
            </div>
            <p className="text-slate-400 text-base leading-relaxed">
              Ask questions in plain language and receive clear, practical answers tailored to your specific crop and situation.
            </p>
          </article>
        </div>
      </section>

      {/* What You Can Ask Section */}
      <section className="px-4 py-14 sm:py-16 md:py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-100 text-center mb-4">
          What You Can Ask
        </h2>
        <p className="text-slate-400 text-center mb-10 md:mb-12">
          Example questions to get you started
        </p>

        <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
          {[
            "Why are my tomato leaves turning yellow?",
            "How do I treat powdery mildew on cucumbers?",
            "What's the best fertilizer for corn?",
            "How often should I water my wheat crop?",
            "Signs of nitrogen deficiency in plants?",
            "How to prevent late blight in potatoes?",
          ].map((question, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-xl bg-slate-900/60 border border-slate-700/80 hover:border-slate-600 text-slate-300 text-sm sm:text-base transition-colors"
            >
              &ldquo;{question}&rdquo;
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:py-20 md:py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100">
            Ready to Improve Your Crop Health?
          </h2>
          <p className="text-lg md:text-xl text-slate-400">
            Join farmers worldwide using AI to make better farming decisions.
          </p>
          {status !== "loading" && !session && (
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg transition-all hover:shadow-lg hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Start Free Today
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
