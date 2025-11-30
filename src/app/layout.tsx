import "./globals.css";
import { ReactNode } from "react";
import Providers from "@/components/Providers";

export const metadata = {
  title: "AgriLens AI - Your AI-Powered Crop Health Assistant",
  description: "Get instant expert advice on crop diseases, pests, soil health, and farm management. Powered by advanced AI technology.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="bg-slate-950 text-slate-100" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
