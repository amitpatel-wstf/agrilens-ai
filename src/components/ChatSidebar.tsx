import { Chat } from "./ChatLayout";

export default function ChatSidebar({
  chats,
  loading,
  selectedChatId,
  onSelectChat,
  onNewChat,
}: {
  chats: Chat[];
  loading: boolean;
  selectedChatId: string | null;
  onSelectChat: (id: string | null) => void;
  onNewChat: () => void;
}) {
  return (
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
              <button
                onClick={() => onSelectChat(chat._id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  chat._id === selectedChatId
                    ? "bg-slate-800 text-slate-50"
                    : "hover:bg-slate-900 text-slate-300"
                }`}
              >
                {chat.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
