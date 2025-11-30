export default function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant" | "system";
  content: string;
}) {
  const isUser = role === "user";
  const isAssistant = role === "assistant";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } text-sm whitespace-pre-wrap`}
    >
      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 ${
          isUser
            ? "bg-emerald-600 text-white"
            : "bg-slate-800 text-slate-100"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
