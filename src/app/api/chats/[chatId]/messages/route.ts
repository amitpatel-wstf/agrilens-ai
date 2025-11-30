import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Chat } from "@/lib/models/Chat";
import { Message } from "@/lib/models/Message";
import { User } from "@/lib/models/User";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  const chat = await Chat.findOne({ _id: chatId, userId: user._id });

  if (!chat) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });
  return NextResponse.json(messages);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ error: "Content required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    const chat = await Chat.findOne({ _id: chatId, userId: user._id });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Check if this is the first message and update chat title
    const messageCount = await Message.countDocuments({ chatId: chat._id });
    if (messageCount === 0 && chat.title === "New chat") {
      // Update title with first 50 chars of user message
      const newTitle = content.length > 50 ? content.substring(0, 50) + "..." : content;
      chat.title = newTitle;
    }

    // Save user message
    const userMsg = await Message.create({
      chatId: chat._id,
      userId: user._id,
      role: "user",
      content,
    });

    // Get conversation history for context (exclude the just-saved message)
    const previousMessages = await Message.find({ 
      chatId: chat._id,
      _id: { $ne: userMsg._id }
    })
      .sort({ createdAt: 1 })
      .limit(10);

    // Call Gemini AI
    const { getAgricultureModel } = await import("@/lib/gemini");
    const model = getAgricultureModel();

    const chatHistory = previousMessages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chatSession = model.startChat({
      history: chatHistory,
    });

    const result = await chatSession.sendMessage(content);
    const assistantText = result.response.text();

    const assistantMsg = await Message.create({
      chatId: chat._id,
      role: "assistant",
      content: assistantText,
    });

    chat.lastMessageAt = new Date();
    await chat.save();

    return NextResponse.json({ userMsg, assistantMsg, chat }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/chats/[chatId]/messages:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process message" },
      { status: 500 }
    );
  }
}
