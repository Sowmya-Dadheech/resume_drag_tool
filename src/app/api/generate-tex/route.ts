import { NextResponse } from "next/server";
import { downloadCache } from "@/lib/downloadCache";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { latex, title } = await request.json();

    if (!latex) {
      return NextResponse.json({ error: "LaTeX content is required" }, { status: 400 });
    }

    const id = uuidv4();
    const filename = `${title || "resume"}.tex`;

    downloadCache.set(id, {
      data: latex,
      contentType: "application/x-tex",
      filename,
    });

    // Clean up after 5 minutes to prevent memory leaks
    setTimeout(() => {
      downloadCache.delete(id);
    }, 5 * 60 * 1000);

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Generate TEX error:", error);
    return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
