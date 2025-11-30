import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Chat } from "@/lib/models/Chat";
import { User } from "@/lib/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  const chats = await Chat.find({ userId: user._id }).sort({ updatedAt: -1 });
  return NextResponse.json(chats);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title } = await req.json();
  await connectDB();
  const user = await User.findOne({ email: session.user.email });

  const chat = await Chat.create({
    userId: user._id,
    title: title || "New chat",
  });

  return NextResponse.json(chat, { status: 201 });
}
