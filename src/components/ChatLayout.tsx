"use client";

import { useEffect, useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export interface Chat {
  _id: string;
  title: string;
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
  }

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-[calc(100vh-56px)] flex">
      <ChatSidebar
        chats={chats}
        loading={loading}
        selectedChatId={selectedChatId}
        onSelectChat={onSelectChat}
        onNewChat={startNewChat}
        onChatUpdated={fetchChats}
      />
      <ChatWindow
        chatId={selectedChatId}
        onChatUpdated={fetchChats}
        onChatCreated={(id) => {
          fetchChats();
          onSelectChat(id);
        }}
      />
    </div>
  );
}
