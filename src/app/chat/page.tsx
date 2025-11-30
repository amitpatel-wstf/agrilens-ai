"use client";

import { useEffect, useState } from "react";
import ChatLayout from "@/components/ChatLayout";
import Navbar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-24">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <Navbar />
      <ChatLayout
        selectedChatId={selectedChatId}
        onSelectChat={setSelectedChatId}
      />
    </>
  );
}
