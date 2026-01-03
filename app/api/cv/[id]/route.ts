import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import CV from "@/lib/models/CV";
import { generateShareableLink } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const cv = await CV.findById(params.id);

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    return NextResponse.json({ cv }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, isPublic } = await req.json();

    await connectDB();
    const cv = await CV.findOne({ _id: params.id, userId: session.user.id });

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    cv.title = title || cv.title;
    cv.content = content || cv.content;
    cv.isPublic = isPublic !== undefined ? isPublic : cv.isPublic;
    
    if (isPublic && !cv.shareableLink) {
      cv.shareableLink = generateShareableLink(cv._id);
    }

    await cv.save();

    return NextResponse.json({ cv }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const cv = await CV.findOneAndDelete({ _id: params.id, userId: session.user.id });

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "CV deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
