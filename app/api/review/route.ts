import { NextRequest, NextResponse } from "next/server";
import { reviewDiff } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  let body: { diff?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const diff = body.diff?.trim();
  if (!diff) {
    return NextResponse.json(
      { error: "diff field is required and must not be empty" },
      { status: 400 }
    );
  }

  try {
    const result = await reviewDiff(diff);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/review] Gemini error:", err);
    return NextResponse.json(
      { error: "Failed to analyse diff. Please try again." },
      { status: 500 }
    );
  }
}
