"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Modal from "./Modal";
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
  const { data: session } = useSession();
  const router = useRouter();
  const [contextMenu, setContextMenu] = useState<{
    chatId: string;
    x: number;
    y: number;
  } | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const [deleteModal, setDeleteModal] = useState<{ show: boolean; chatId: string | null }>({
    show: false,
    chatId: null,
  });

  const handleDelete = async (chatId: string) => {
    setDeleteModal({ show: true, chatId });
    setContextMenu(null);
  };

  const confirmDelete = async () => {
    if (!deleteModal.chatId) return;
    try {
      const res = await fetch(`/api/chats/${deleteModal.chatId}`, { method: "DELETE" });
      if (res.ok) {
        if (selectedChatId === deleteModal.chatId) {
          onSelectChat(null);
        }
        onChatUpdated();
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
    setDeleteModal({ show: false, chatId: null });
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

        {/* Profile Section */}
        {session?.user && (
          <div className="border-t border-slate-800 p-3">
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-all"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-700">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950"></div>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium truncate">{session.user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
                </div>
                <svg 
                  className={`w-4 h-4 text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
                  <Link
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700 transition-colors"
                  >
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm">Profile</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700 transition-colors"
                  >
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm">Settings</span>
                  </Link>

                  <div className="border-t border-slate-700"></div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors w-full text-left text-red-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, chatId: null })}
        onConfirm={confirmDelete}
        title="Delete Chat"
        message="Are you sure you want to delete this chat? This action cannot be undone."
        type="confirm"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}
