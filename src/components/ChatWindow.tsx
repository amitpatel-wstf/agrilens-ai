"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import LoadingDots from "./LoadingDots";

interface Message {
  _id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

export default function ChatWindow({ chatId }: { chatId: string | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

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

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatId || !input.trim()) return;
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
    } catch (err) {
      console.error(err);
      // revert optimistically added user message
      setMessages((prev) => prev.filter((m) => m._id !== tempUserMsg._id));
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  }

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
        className="border-t border-slate-800 p-3 flex gap-2"
      >
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 resize-none rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Ask something about your crops..."
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-sm font-medium"
        >
          Send
        </button>
      </form>
    </section>
  );
}
