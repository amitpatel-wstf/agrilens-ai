"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`mb-6 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-emerald-500 text-white"
            : "bg-slate-800 text-slate-100 border border-slate-700"
        }`}
      >
        {isUser ? (
          <p className="text-sm md:text-base whitespace-pre-wrap break-words">{content}</p>
        ) : (
          <div className="prose prose-invert prose-sm md:prose-base max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Headings
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mt-6 mb-4 text-emerald-400 border-b border-slate-700 pb-2">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold mt-5 mb-3 text-emerald-400">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold mt-4 mb-2 text-emerald-300">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-base font-semibold mt-3 mb-2 text-slate-200">
                    {children}
                  </h4>
                ),
                
                // Paragraphs
                p: ({ children }) => (
                  <p className="mb-3 leading-relaxed text-slate-200">
                    {children}
                  </p>
                ),
                
                // Lists
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2 text-slate-200">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2 text-slate-200">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="ml-4 pl-2">
                    {children}
                  </li>
                ),
                
                // Code
                code: ({ inline, children, ...props }: any) =>
                  inline ? (
                    <code
                      className="bg-slate-900 text-emerald-400 px-1.5 py-0.5 rounded text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  ) : (
                    <code
                      className="block bg-slate-900 text-emerald-400 p-3 rounded-lg overflow-x-auto text-sm font-mono my-3"
                      {...props}
                    >
                      {children}
                    </code>
                  ),
                
                // Blockquotes
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-4 italic text-slate-300 bg-slate-900/50 rounded-r">
                    {children}
                  </blockquote>
                ),
                
                // Links
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 underline"
                  >
                    {children}
                  </a>
                ),
                
                // Strong/Bold
                strong: ({ children }) => (
                  <strong className="font-bold text-white">
                    {children}
                  </strong>
                ),
                
                // Emphasis/Italic
                em: ({ children }) => (
                  <em className="italic text-slate-300">
                    {children}
                  </em>
                ),
                
                // Horizontal Rule
                hr: () => (
                  <hr className="my-6 border-slate-700" />
                ),
                
                // Tables
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full border border-slate-700 rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-slate-900">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-slate-700">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-slate-900/50">
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-2 text-left font-semibold text-emerald-400 border-b border-slate-700">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-2 text-slate-200">
                    {children}
                  </td>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
