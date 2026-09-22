import { NextResponse } from "next/server";
import { downloadCache } from "@/lib/downloadCache";
import { v4 as uuidv4 } from "uuid";

function sanitizeLatex(latex: string): string {
  if (!latex) return "";
  let sanitized = latex;
  // Auto-fix typo'd closing parenthesis on argument braces like }{Seattle, WA)
  sanitized = sanitized.replace(/}\s*{([^}]+)\)/g, "}{$1}");
  // Replace math-mode pipe variations and double dashes for pdflatex font safety
  sanitized = sanitized.replace(/\$\|\$/g, " - ");
  sanitized = sanitized.replace(/\|\$\|/g, " - ");
  sanitized = sanitized.replace(/\$\|/g, " - ");
  sanitized = sanitized.replace(/\|\$/g, " - ");
  sanitized = sanitized.replace(/--/g, "-");
  return sanitized;
}

export async function POST(request: Request) {
  try {
    const { latex: rawLatex, title } = await request.json();

    if (!rawLatex) {
      return NextResponse.json({ error: "LaTeX content is required" }, { status: 400 });
    }

    const latex = sanitizeLatex(rawLatex);

    // Call LaTeX-on-HTTP endpoint
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
      let userFriendlyMessage = "LaTeX compilation failed.";
      try {
        const parsedError = JSON.parse(errorText);
        if (parsedError.log_files && parsedError.log_files["__main_document__.log"]) {
          const log = parsedError.log_files["__main_document__.log"];
          const lineMatch = log.match(/l\.(\d+)\s+(.*)/);
          if (lineMatch) {
            userFriendlyMessage = `LaTeX error at line ${lineMatch[1]}: ${lineMatch[2].slice(0, 100)}`;
          }
        }
      } catch (e) {
        userFriendlyMessage = errorText.slice(0, 150);
      }
      return NextResponse.json({ error: userFriendlyMessage }, { status: 500 });
    }

    const pdfBuffer = await response.arrayBuffer();
    const id = uuidv4();
    const filename = `${title || "resume"}.pdf`;

    // Cache the PDF so it can be served cleanly via /api/download/[id]?inline=true
    downloadCache.set(id, {
      data: Buffer.from(pdfBuffer),
      contentType: "application/pdf",
      filename,
    });

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "X-PDF-Id": id,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
  }
}

