import { NextResponse } from "next/server";

function sanitizeLatex(latex: string): string {
  if (!latex) return "";
  let sanitized = latex;
  // Replace math-mode pipe variations in text blocks ($|$, |$|, $|, |$)
  sanitized = sanitized.replace(/\$\|\$/g, " -- ");
  sanitized = sanitized.replace(/\|\$\|/g, " -- ");
  sanitized = sanitized.replace(/\$\|/g, " -- ");
  sanitized = sanitized.replace(/\|\$/g, " -- ");
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

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(title || "resume")}.pdf"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
  }
}
