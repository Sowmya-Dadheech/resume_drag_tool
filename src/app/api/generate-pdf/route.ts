import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { latex, title } = await request.json();

    if (!latex) {
      return NextResponse.json({ error: "LaTeX content is required" }, { status: 400 });
    }

    // Using LaTeX-on-HTTP service
    // Endpoint: https://latex.ytotech.com/request.php
    // Parameters: code, format=pdf
    
    // Using the newer LaTeX-on-HTTP endpoint
    const response = await fetch("https://latex.ytotech.com/builds/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        compiler: "pdflatex",
        resources: [
          {
            main: true,
            content: latex
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LaTeX service error:", errorText);
      return NextResponse.json({ error: `LaTeX compilation failed: ${errorText}` }, { status: 500 });
    }

    const pdfBuffer = await response.arrayBuffer();

    const { v4: uuidv4 } = require("uuid");
    const { downloadCache } = require("@/lib/downloadCache");
    
    // We need to get title from the parsed JSON at the top
    const id = uuidv4();
    const filename = `${title || "resume"}.pdf`;

    downloadCache.set(id, {
      data: pdfBuffer,
      contentType: "application/pdf",
      filename: filename
    });

    setTimeout(() => downloadCache.delete(id), 5 * 60 * 1000);

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
