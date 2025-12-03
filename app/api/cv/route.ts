import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import CV from "@/lib/models/CV";
import { generateShareableLink } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const cvs = await CV.find({ userId: session.user.id }).sort({ updatedAt: -1 });

    return NextResponse.json({ cvs }, { status: 200 });
  } catch (error) {
    console.error("Get CVs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, templateId, isPublic } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const cv = await CV.create({
      title,
      userId: session.user.id,
      templateId,
      content,
      isPublic: isPublic || false,
      shareableLink: isPublic ? generateShareableLink() : undefined,
    });

    return NextResponse.json({ cv }, { status: 201 });
  } catch (error) {
    console.error("Create CV error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
