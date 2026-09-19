import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { latex, title } = await request.json();

    if (!latex) {
      return NextResponse.json({ error: "LaTeX content is required" }, { status: 400 });
    }

    return new Response(latex, {
      status: 200,
      headers: {
        "Content-Type": "application/x-tex; charset=utf-8",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(title || "resume")}.tex"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
