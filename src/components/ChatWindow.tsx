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
  onChatCreated,
  onOpenSidebar,
}: {
  chatId: string | null;
  onChatUpdated?: () => void;
  onChatCreated?: (chatId: string) => void;
  onOpenSidebar?: () => void;
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

  const handleInitialMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const userContent = input.trim();
    if (!userContent || loading) return;

    setInput("");
    setLoading(true);

    try {
      const title = userContent.length > 80 ? userContent.slice(0, 80) + "…" : userContent;
      const createRes = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.error || "Failed to create chat");
      }
      const newChat = await createRes.json();

      const msgRes = await fetch(`/api/chats/${newChat._id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userContent }),
      });
      const msgData = await msgRes.json();
      if (!msgRes.ok) throw new Error(msgData.error || "Failed to send message");

      onChatCreated?.(newChat._id);
      onChatUpdated?.();
    } catch (error) {
      console.error("Failed to create chat or send message:", error);
      setInput(userContent);
      setModal({
        show: true,
        type: "error",
        title: "Failed to Start Chat",
        message: "Failed to create the chat or send your message. Please try again.",
      });
    } finally {
      setLoading(false);
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

  const suggestedQuestions = [
    "Why are my tomato leaves turning yellow?",
    "How to treat powdery mildew on cucumbers?",
    "Best fertilizer for corn crops?",
    "Signs of nitrogen deficiency in plants?",
  ];

  const handleSuggestionClick = (question: string) => {
    setInput(question);
  };

  if (!chatId) {
    return (
      <section className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Mobile: top bar with menu button */}
        {onOpenSidebar && (
          <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 sm:py-3 border-b border-slate-800 md:hidden">
            <button
              type="button"
              aria-label="Open chats"
              onClick={onOpenSidebar}
              className="p-2.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-sm font-medium text-slate-200">New chat</span>
          </div>
        )}

        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto min-h-0">
          <div className="w-full max-w-3xl space-y-6 sm:space-y-8">
            <div className="text-center space-y-3 sm:space-y-4">
              <h1 className="text-2xl min-[480px]:text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100 px-2">
                What can I help you with today?
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-400 px-2">
                Ask me anything about crop health, diseases, pests, or farming practices
              </p>
            </div>

            <form onSubmit={handleInitialMessage} className="w-full">
              <div className="relative">
                <textarea
                  rows={1}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your crops..."
                  className="w-full resize-none rounded-xl sm:rounded-2xl bg-slate-900 border border-slate-700 px-4 sm:px-6 py-3.5 sm:py-4 pr-12 sm:pr-14 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 max-h-[200px] overflow-y-auto placeholder:text-slate-500 min-h-[48px] sm:min-h-[56px]"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Send"
                  className="absolute right-2.5 sm:right-3 bottom-2.5 sm:bottom-3 p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {suggestedQuestions.map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSuggestionClick(prompt)}
                  className="text-left p-3 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition-all group min-h-[44px]"
                >
                  <p className="text-xs sm:text-sm text-slate-300 group-hover:text-slate-100 line-clamp-2">
                    {prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const showSuggestedQuestions = messages.length === 0 && !loading;

  return (
    <section className="flex-1 flex flex-col min-w-0 bg-slate-950">
      {/* Mobile: top bar with menu button */}
      {onOpenSidebar && (
        <div className="flex-shrink-0 flex items-center gap-2 px-3 py-2 sm:py-3 border-b border-slate-800 md:hidden">
          <button
            type="button"
            aria-label="Open chats"
            onClick={onOpenSidebar}
            className="p-2.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-sm font-medium text-slate-200 truncate">Chat</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-3 sm:px-4 py-3 sm:py-4 space-y-4">
        {showSuggestedQuestions ? (
          <>
            <div className="max-w-2xl mx-auto pt-4 sm:pt-8 space-y-4 sm:space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-100 px-2">
                  What can I help you with today?
                </h2>
                <p className="text-sm sm:text-base text-slate-400 px-2">
                  Choose a question below or type your own
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-2 sm:pt-4">
                {suggestedQuestions.map((question, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSuggestionClick(question)}
                    className="text-left p-3 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 transition-all group min-h-[44px]"
                  >
                    <p className="text-xs sm:text-sm text-slate-300 group-hover:text-slate-100 line-clamp-2">
                      {question}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="flex-shrink-0 border-t border-slate-800 p-2 sm:p-3 flex gap-2 sm:gap-3 items-end"
      >
        <textarea
          rows={1}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 resize-none rounded-lg sm:rounded-md bg-slate-900 border border-slate-700 px-3 py-2.5 sm:py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 max-h-[200px] overflow-y-auto placeholder:text-slate-500 min-h-[44px] sm:min-h-[40px]"
          placeholder="Ask about your crops..."
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex-shrink-0 px-4 py-2.5 sm:py-2 rounded-lg sm:rounded-md bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-sm font-medium transition-colors min-h-[44px] sm:min-h-[40px] text-white"
        >
          {loading ? "…" : "Send"}
        </button>
      </form>
    </section>
  );
}
