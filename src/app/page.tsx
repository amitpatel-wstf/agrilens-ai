"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-20 md:py-32">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left side - Text content */}
              <div className="space-y-8 text-center md:text-left">
                {/* Main heading with gradient */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in">
                  Your AI-Powered{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                    Crop Health
                  </span>{" "}
                  Assistant
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-slate-300 animate-fade-in-delay">
                  Get instant expert advice on crop diseases, pests, soil health, and farm management.
                  Powered by advanced AI technology.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start animate-fade-in-delay-2">
                  {status === "loading" ? (
                    <div className="px-8 py-4 rounded-lg bg-slate-800 text-slate-400">
                      Loading...
                    </div>
                  ) : session ? (
                    <Link
                      href="/chat"
                      className="group px-8 py-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/25"
                    >
                      Start Chatting
                      <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/auth/signin"
                        className="group px-8 py-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/25"
                      >
                        Get Started
                        <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </Link>
                      <Link
                        href="/auth/signin"
                        className="px-8 py-4 rounded-lg border-2 border-slate-700 hover:border-emerald-500 hover:bg-slate-800 font-semibold text-lg transition-all"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Right side - Image */}
              <div className="relative animate-fade-in-delay-2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/20 border border-slate-800 bg-slate-900">
                  <Image
                    src="/landing_pic.png"
                    alt="AgriLens AI - Crop Health Analysis"
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  {/* Overlay gradient for better integration */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none" />
                </div>
                {/* Decorative elements around image */}
                <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 blur-2xl rounded-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-16 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How AgriLens AI Helps You
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Disease Detection</h3>
              <p className="text-slate-400">
                Identify crop diseases, pests, and nutrient deficiencies with AI-powered analysis and get actionable treatment recommendations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
              <p className="text-slate-400">
                Get practical, step-by-step advice on soil health, irrigation, fertilization, and integrated pest management strategies.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-all hover:transform hover:scale-105">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Answers</h3>
              <p className="text-slate-400">
                Ask questions in plain language and receive clear, practical answers tailored to your specific crop and situation.
              </p>
            </div>
          </div>
        </section>

        {/* What You Can Ask Section */}
        <section className="px-4 py-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What You Can Ask
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
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
                className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-default"
              >
                <p className="text-slate-300">"{question}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Improve Your Crop Health?
            </h2>
            <p className="text-xl text-slate-300">
              Join farmers worldwide using AI to make better farming decisions.
            </p>
            {status !== "loading" && !session && (
              <Link
                href="/auth/signin"
                className="inline-block px-8 py-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/25"
              >
                Start Free Today
              </Link>
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </>
  );
}
