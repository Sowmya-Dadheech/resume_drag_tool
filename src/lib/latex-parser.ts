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
      const items = sectionContent.split(/(?=\\resumeSubheading|\\item \\textbf)/);
      items.forEach((item, idx) => {
        const cleanItem = item.replace(/\\begin{itemize}/g, "").replace(/\\end{itemize}/g, "").replace(/\\resumeSubHeadingListStart/g, "").replace(/\\resumeSubHeadingListEnd/g, "").trim();
        if (!cleanItem) return;
        const subMatch = cleanItem.match(/\\resumeSubheading\s*\{([^}]*)\}/);
        const titleMatch = cleanItem.match(/\\textbf{([^}]*)}/);
        const title = subMatch ? subMatch[1].trim() : (titleMatch ? titleMatch[1].replace(/:$/, "").trim() : `${type.charAt(0).toUpperCase() + type.slice(1)} ${idx + 1}`);
        blocks.push({ id: uuidv4(), type, title, content: cleanItem });
      });
    } else {
      blocks.push({ id: uuidv4(), type, title: sectionTitle, content: sectionContent });
    }
  }
  
  return blocks;
}

export function generateFullLatex(blocks: LibraryBlock[], preamble: string): string {
  let latex = preamble + "\n\\begin{document}\n\\fontsize{9pt}{11pt}\\selectfont\n";
  
  // Header block check
  const headerBlock = blocks.find(b => b.type === "header");
  if (headerBlock) {
    latex += headerBlock.content.trim() + "\n\n";
  } else {
    latex += `\\begin{tabular*}{1.0\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{\\Huge Sowmya Dadheech} & Mobile: +1 (206) 579-0694 \\\\
  MS in Data Science at University of Washington, Seattle & \\href{https://sowmyadadheech.com}{\\textcolor{linkblue}{Portfolio}} -- \\href{https://linkedin.com/in/sowmya-dadheech}{\\textcolor{linkblue}{LinkedIn}} -- \\href{https://github.com/Sowmya-Dadheech-20}{\\textcolor{linkblue}{GitHub}} \\\\
  Email: \\href{mailto:sowmya20@uw.edu}{\\textcolor{linkblue}{sowmya20@uw.edu}} & \\\\
\\end{tabular*}
\\vspace{-8pt}
`;
  }
  
  const types: BlockType[] = ["education", "experience", "projects", "skills", "publications"];
  
  types.forEach(type => {
    const typeBlocks = blocks.filter(b => b.type === type);
    if (typeBlocks.length > 0) {
      // Use exact section title from user's snippet
      const sectionTitle = type === "skills" ? "Skills" : type.charAt(0).toUpperCase() + type.slice(1);
      latex += `\n\\section{${sectionTitle}}\n`;
      
      const needsList = type === "experience" || type === "projects" || type === "education" || type === "skills";
      if (needsList) {
        const listStart = "\\resumeSubHeadingListStart\n";
        const listEnd = "\\resumeSubHeadingListEnd\n";
        
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
