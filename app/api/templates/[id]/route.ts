import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Template from "@/lib/models/Template";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const template = await Template.findById(params.id);

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ template }, { status: 200 });
  } catch (error) {
    console.error("Get template error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
