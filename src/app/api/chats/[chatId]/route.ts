import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Chat } from "@/lib/models/Chat";
import { Message } from "@/lib/models/Message";
import { User } from "@/lib/models/User";

// Update chat title
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId: user._id },
      { title },
      { new: true }
    );

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(chat);
  } catch (error: any) {
    console.error("Error updating chat:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update chat" },
      { status: 500 }
    );
  }
}

// Delete chat
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    const chat = await Chat.findOneAndDelete({ _id: chatId, userId: user._id });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // Delete all messages in this chat
    await Message.deleteMany({ chatId: chat._id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete chat" },
      { status: 500 }
    );
  }
}
