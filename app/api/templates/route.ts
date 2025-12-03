import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Template from "@/lib/models/Template";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();

    const query = session?.user?.role === 'admin' 
      ? {} 
      : { isApproved: true };

    const templates = await Template.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ templates }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, thumbnail, structure, category, isPremium } = await req.json();

    if (!name || !description || !thumbnail || !structure || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const template = await Template.create({
      name,
      description,
      thumbnail,
      structure,
      category,
      isPremium: isPremium || false,
      isApproved: session.user.role === 'admin',
      createdBy: session.user.id,
    });

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
