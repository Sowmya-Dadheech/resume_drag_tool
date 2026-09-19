import { NextResponse } from "next/server";
import { downloadCache } from "@/lib/downloadCache";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const item = downloadCache.get(id);

    if (!item) {
      return new NextResponse("Download link expired or invalid", { status: 404 });
    }

    const url = new URL(request.url);
    const isInline = url.searchParams.get("inline") === "true";
    const disposition = isInline ? "inline" : `attachment; filename="${item.filename}"`;

    return new Response(item.data as BodyInit, {
      headers: {
        "Content-Type": item.contentType,
        "Content-Disposition": disposition,
      },
    });
  } catch (error: any) {
    console.error("Download endpoint error:", error);
    return new NextResponse(`Internal server error: ${error.message}`, { status: 500 });
  }
}
