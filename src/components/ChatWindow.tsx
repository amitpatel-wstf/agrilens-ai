"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import LoadingDots from "./LoadingDots";
import Modal from "./Modal";

interface Message {
  _id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export default function ChatWindow({ 
  chatId,
  onChatUpdated,
}: { 
  chatId: string | null;
  onChatUpdated?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [modal, setModal] = useState<{
    show: boolean;
    type: "error";
    title: string;
    message: string;
  }>({
    show: false,
    type: "error",
    title: "",
    message: "",
  });

  useEffect(() => {
    if (!chatId) return;
    const fetchMessages = async () => {
      const res = await fetch(`/api/chats/${chatId}/messages`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data);
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!chatId || !input.trim() || loading) return;
    const userContent = input.trim();
    setInput("");

    // Optimistic update
    const tempUserMsg: Message = {
      _id: Math.random().toString(),
      role: "user",
      content: userContent,
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content: userContent }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error sending message");

      setMessages((prev) => [
        ...prev.filter((m) => m._id !== tempUserMsg._id),
        data.userMsg,
        data.assistantMsg,
      ]);
      
      // Update chat list if title changed
      if (data.chat && onChatUpdated) {
        onChatUpdated();
      }
    } catch (err) {
      console.error(err);
      // revert optimistically added user message
      setMessages((prev) => prev.filter((m) => m._id !== tempUserMsg._id));
      setModal({
        show: true,
        type: "error",
        title: "Failed to Send",
        message: "Failed to send your message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  if (!chatId) {
    return (
      <section className="flex-1 flex items-center justify-center text-slate-500">
        <p>Select or create a chat to begin.</p>
      </section>
    );
  }

  return (
    <section className="flex-1 flex flex-col bg-slate-950">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg._id} role={msg.role} content={msg.content} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg bg-slate-800 px-3 py-2">
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <form
        onSubmit={sendMessage}
        className="border-t border-slate-800 p-3 flex gap-2 items-end"
      >
        <textarea
          rows={1}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          className="flex-1 resize-none rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 max-h-[200px] overflow-y-auto"
          placeholder="Ask something about your crops... (Press Enter to send, Shift+Enter for new line)"
          style={{ minHeight: "40px" }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-sm font-medium transition-colors"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  );
}
