"use client";

import { useEffect, useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export interface Chat {
  _id: string;
  title: string;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export default function ChatLayout({
  selectedChatId,
  onSelectChat,
}: {
  selectedChatId: string | null;
  onSelectChat: (id: string | null) => void;
}) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  async function fetchChats() {
    setLoading(true);
    const res = await fetch("/api/chats");
    const data = await res.json();
    setChats(data);
    setLoading(false);
    if (!selectedChatId && data.length > 0) {
      onSelectChat(data[0]._id);
    }
  }

  function startNewChat() {
    onSelectChat(null);
    if (isMobile) setSidebarOpen(false);
  }

  function handleSelectChat(id: string | null) {
    onSelectChat(id);
    if (isMobile) setSidebarOpen(false);
  }

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-[calc(100vh-56px)] min-h-[calc(100dvh-56px)] flex w-full min-w-0 overflow-hidden">
      {/* Backdrop when sidebar is open on mobile */}
      {isMobile && sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 top-14 z-30 bg-black/50 md:hidden"
        />
      )}

      <ChatSidebar
        chats={chats}
        loading={loading}
        selectedChatId={selectedChatId}
        onSelectChat={handleSelectChat}
        onNewChat={startNewChat}
        onChatUpdated={fetchChats}
        isMobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      <ChatWindow
        chatId={selectedChatId}
        onChatUpdated={fetchChats}
        onChatCreated={(id) => {
          fetchChats();
          onSelectChat(id);
          if (isMobile) setSidebarOpen(false);
        }}
        onOpenSidebar={isMobile ? () => setSidebarOpen(true) : undefined}
      />
    </div>
  );
}
