/**
 * Escapes LaTeX special characters in user input to prevent compilation errors.
 */
export function escapeLatex(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

/**
 * Strips common LaTeX commands to get raw text for editing.
 * This is a simplified version for the specific template.
 */
export function stripLatex(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\textbf{([^}]*)}/g, "$1")
    .replace(/\\textit{([^}]*)}/g, "$1")
    .replace(/\\href{[^}]*}{([^}]*)}/g, "$1")
    .replace(/\\textcolor{[^}]*}{([^}]*)}/g, "$1")
    .replace(/\\item /g, "")
    .replace(/\\underline{([^}]*)}/g, "$1");
}
