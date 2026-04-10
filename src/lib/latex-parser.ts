import { LibraryBlock, BlockType } from "./types";
import { v4 as uuidv4 } from "uuid";

function stripComments(latex: string): string {
  // Only remove comments that start with % but are not preceded by \
  return latex.replace(/(?<!\\)%.*/g, "");
}

export function parseLatexToLibrary(latex: string): LibraryBlock[] {
  const blocks: LibraryBlock[] = [];
  
  const documentMatch = latex.match(/\\begin{document}([\s\S]*)\\end{document}/);
  const content = documentMatch ? stripComments(documentMatch[1]) : stripComments(latex);
  const sections = content.split(/\\section{([^}]*)}/);
  
  // Header
  const headerContent = sections[0].trim();
  if (headerContent) {
    blocks.push({
      id: "header-block",
      type: "header",
      title: "Header Content",
      content: headerContent
    });
  }
  
  for (let i = 1; i < sections.length; i += 2) {
    const sectionTitle = sections[i];
    let sectionContent = sections[i + 1]?.trim() || "";
    let type: BlockType = "experience";
    
    if (sectionTitle.toLowerCase().includes("education")) type = "education";
    else if (sectionTitle.toLowerCase().includes("experience")) type = "experience";
    else if (sectionTitle.toLowerCase().includes("projects")) type = "projects";
    else if (sectionTitle.toLowerCase().includes("skills")) type = "skills";
    else if (sectionTitle.toLowerCase().includes("publications")) type = "publications";

    // Split section into individual items
    if (type === "experience") {
      const items = sectionContent.split(/(?=\\resumeSubheadingWithDetail|\\resumeSubheading)/);
      items.forEach((item, idx) => {
        const cleanItem = item.trim();
        if (!cleanItem || (!cleanItem.includes("\\resumeSubheading") && !cleanItem.includes("\\resumeSubheadingWithDetail"))) return;
        
        const titleMatch = cleanItem.match(/\\resumeSubheading(?:WithDetail)?{([^}]*)}/);
        const title = titleMatch ? titleMatch[1].trim() : `Experience Item ${idx + 1}`;
        blocks.push({ id: uuidv4(), type, title, content: cleanItem });
      });
    } else if (type === "projects") {
      const regex = /\\item \\textbf{([^}]*)}/g;
      let match;
      const positions: number[] = [];
      const titles: string[] = [];
      while ((match = regex.exec(sectionContent)) !== null) {
        positions.push(match.index);
        titles.push(match[1]);
      }
      
      positions.forEach((pos, idx) => {
        const nextPos = positions[idx + 1] || sectionContent.length;
        const itemContent = sectionContent.substring(pos, nextPos).trim();
        const cleanContent = itemContent.replace(/\\resumeSubHeadingListStart/g, "").replace(/\\resumeSubHeadingListEnd/g, "").trim();
        if (cleanContent && cleanContent.includes("\\item")) {
          blocks.push({ id: uuidv4(), type, title: titles[idx], content: cleanContent });
        }
      });
    } else if (type === "education" || type === "skills") {
      const items = sectionContent.split(/(?=\\item \\textbf)/);
      items.forEach((item, idx) => {
        const cleanItem = item.replace(/\\begin{itemize}/g, "").replace(/\\end{itemize}/g, "").replace(/\\resumeSubHeadingListStart/g, "").replace(/\\resumeSubHeadingListEnd/g, "").trim();
        if (!cleanItem || !cleanItem.includes("\\item")) return;
        const titleMatch = cleanItem.match(/\\textbf{([^}]*)}/);
        const title = titleMatch ? titleMatch[1].replace(/:$/, "").trim() : `${type.charAt(0).toUpperCase() + type.slice(1)} ${idx + 1}`;
        blocks.push({ id: uuidv4(), type, title, content: cleanItem });
      });
    } else {
      blocks.push({ id: uuidv4(), type, title: sectionTitle, content: sectionContent });
    }
  }
  
  return blocks;
}

export function generateFullLatex(blocks: LibraryBlock[], preamble: string): string {
  let latex = preamble + "\n\\begin{document}\n\\fontsize{9}{10}\\selectfont\n";
  
  // Hardcoded unchangeable main header block
  latex += `
\\noindent
{\\Huge \\textbf{John Doe}}

\\vspace{6pt}
\\noindent
\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  B.S. in Computer Science at Example University & Mobile: +1 1234567890 \\\\
  Email: \\href{mailto:johndoe@example.com}{johndoe@example.com} & 
\\href{https://example.com/}{\\textcolor{linkblue}{Portfolio}} $|$ 
\\href{https://www.linkedin.com/in/johndoe/}{\\textcolor{linkblue}{LinkedIn}} $|$ 
\\href{https://github.com/johndoe}{\\textcolor{linkblue}{GitHub}}
\\end{tabular*}
`;
  
  const types: BlockType[] = ["education", "experience", "projects", "skills", "publications"];
  
  types.forEach(type => {
    const typeBlocks = blocks.filter(b => b.type === type);
    if (typeBlocks.length > 0) {
      // Use exact section title from user's snippet
      const sectionTitle = type === "skills" ? "Skills" : type.charAt(0).toUpperCase() + type.slice(1);
      latex += `\n\\section{${sectionTitle}}\n`;
      
      const needsList = type === "experience" || type === "projects" || type === "education" || type === "skills";
      if (needsList) {
        const listStart = type === "experience" || type === "projects" || type === "skills" ? "\\resumeSubHeadingListStart\n" : "\\begin{itemize}\n";
        const listEnd = type === "experience" || type === "projects" || type === "skills" ? "\\resumeSubHeadingListEnd\n" : "\\end{itemize}\n";
        
        latex += listStart;
        typeBlocks.forEach((b, idx) => {
          latex += b.content.trim();
          if (idx < typeBlocks.length - 1) {
             latex += "\n"; // Minimal newline for list items
          } else {
             latex += "\n";
          }
        });
        latex += listEnd;
      } else {
        typeBlocks.forEach(b => {
          latex += b.content.trim() + "\n";
        });
      }
    }
  });
  
  latex += "\\end{document}";
  return latex;
}
