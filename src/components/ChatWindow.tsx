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

  const handleInitialMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Create a new chat first
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New chat" }),
      });
      const newChat = await res.json();
      
      // Update parent to select this chat
      if (onChatUpdated) {
        onChatUpdated();
      }
      
      // The chat will be selected and message will be sent automatically
    } catch (error) {
      console.error("Failed to create chat:", error);
      setModal({
        show: true,
        type: "error",
        title: "Failed to Create Chat",
        message: "Failed to create a new chat. Please try again.",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (chatId) {
        sendMessage();
      } else {
        handleInitialMessage(e);
      }
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
      <section className="flex-1 flex flex-col items-center justify-center bg-slate-950 p-6">
        <div className="w-full max-w-3xl space-y-8">
          {/* Welcome Message */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100">
              What can I help you with today?
            </h1>
            <p className="text-lg text-slate-400">
              Ask me anything about crop health, diseases, pests, or farming practices
            </p>
          </div>

          {/* Centered Input */}
          <form onSubmit={handleInitialMessage} className="w-full">
            <div className="relative">
              <textarea
                rows={1}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your crops..."
                className="w-full resize-none rounded-2xl bg-slate-900 border border-slate-700 px-6 py-4 pr-14 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 max-h-[200px] overflow-y-auto placeholder:text-slate-500"
                style={{ minHeight: "56px" }}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="absolute right-3 bottom-3 p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>

          {/* Example Prompts */}
          <div className="grid md:grid-cols-2 gap-3">
            {[
              "Why are my tomato leaves turning yellow?",
              "How to treat powdery mildew on cucumbers?",
              "Best fertilizer for corn crops?",
              "Signs of nitrogen deficiency in plants?",
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInput(prompt)}
                className="text-left p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition-all group"
              >
                <p className="text-sm text-slate-300 group-hover:text-slate-100">
                  {prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
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
