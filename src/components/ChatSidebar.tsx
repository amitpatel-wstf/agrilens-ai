"use client";

import { useState } from "react";
import { Chat } from "./ChatLayout";

export default function ChatSidebar({
  chats,
  loading,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onChatUpdated,
}: {
  chats: Chat[];
  loading: boolean;
  selectedChatId: string | null;
  onSelectChat: (id: string | null) => void;
  onNewChat: () => void;
  onChatUpdated: () => void;
}) {
  const [contextMenu, setContextMenu] = useState<{
    chatId: string;
    x: number;
    y: number;
  } | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleContextMenu = (e: React.MouseEvent, chat: Chat) => {
    e.preventDefault();
    setContextMenu({ chatId: chat._id, x: e.clientX, y: e.clientY });
  };

  const handleEditClick = (chat: Chat) => {
    setEditingChatId(chat._id);
    setEditTitle(chat.title);
    setContextMenu(null);
  };

  const handleSaveEdit = async (chatId: string) => {
    if (!editTitle.trim()) return;
    try {
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle.trim() }),
      });
      if (res.ok) {
        onChatUpdated();
        setEditingChatId(null);
      }
    } catch (error) {
      console.error("Failed to update chat title:", error);
    }
  };

  const handleDelete = async (chatId: string) => {
    if (!confirm("Are you sure you want to delete this chat?")) return;
    try {
      const res = await fetch(`/api/chats/${chatId}`, { method: "DELETE" });
      if (res.ok) {
        if (selectedChatId === chatId) {
          onSelectChat(null);
        }
        onChatUpdated();
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
    setContextMenu(null);
  };

  return (
    <>
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col">
        <div className="p-3">
          <button
            onClick={onNewChat}
            className="w-full px-3 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-sm font-medium"
          >
            + New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading && <p className="px-3 text-xs text-slate-500">Loading chats...</p>}
          {!loading && chats.length === 0 && (
            <p className="px-3 text-xs text-slate-500">No chats yet.</p>
          )}
          <ul className="space-y-1 px-2">
            {chats.map((chat) => (
              <li key={chat._id}>
                {editingChatId === chat._id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(chat._id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(chat._id);
                      if (e.key === "Escape") setEditingChatId(null);
                    }}
                    autoFocus
                    className="w-full px-3 py-2 rounded-md bg-slate-800 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <button
                    onClick={() => onSelectChat(chat._id)}
                    onContextMenu={(e) => handleContextMenu(e, chat)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm truncate ${
                      chat._id === selectedChatId
                        ? "bg-slate-800 text-slate-50"
                        : "hover:bg-slate-900 text-slate-300"
                    }`}
                    title={chat.title}
                  >
                    {chat.title}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed z-50 bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 min-w-[150px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => {
                const chat = chats.find((c) => c._id === contextMenu.chatId);
                if (chat) handleEditClick(chat);
              }}
              className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700"
            >
              Edit title
            </button>
            <button
              onClick={() => handleDelete(contextMenu.chatId)}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
            >
              Delete chat
            </button>
          </div>
        </>
      )}
    </>
  );
}
