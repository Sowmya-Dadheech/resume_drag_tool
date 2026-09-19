import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { LibraryBlock, BlockType } from "@/lib/types";

// Explicit order for experience and education (reverse chronological: LATEST FIRST!)
const CATEGORY_ORDER: Record<string, string[]> = {
  experience: [
    "QBI_Lab_UW_Research_Assistant.tex",
    "JAL_Trans_Logistics_Data_Science_Intern.tex",
    "Jio_Platform_Limited_ML_Intern.tex",
    "DJSCE_Research_Assistant.tex"
  ],
  education: [
    "University_of_Washington.tex",
    "University_of_Mumbai.tex"
  ]
};

export async function GET() {
  try {
    const libraryDir = path.join(process.cwd(), "src/lib/data/library");
    const categories: (BlockType | "header")[] = ["header", "education", "experience", "projects", "skills", "publications"];
    const blocks: LibraryBlock[] = [];

    for (const category of categories) {
      const categoryPath = path.join(libraryDir, category);
      if (!fs.existsSync(categoryPath)) continue;

      let files = fs.readdirSync(categoryPath).filter(f => f.endsWith(".tex"));

      // Sort files if explicit order is defined
      if (CATEGORY_ORDER[category]) {
        const customOrder = CATEGORY_ORDER[category];
        files.sort((a, b) => {
          const idxA = customOrder.indexOf(a);
          const idxB = customOrder.indexOf(b);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return a.localeCompare(b);
        });
      }

      for (const file of files) {
        const filePath = path.join(categoryPath, file);
        const content = fs.readFileSync(filePath, "utf8");
        
        // Use filename (without extension) as title, replace underscores with spaces
        const title = file.replace(".tex", "").replace(/_/g, " ");

        blocks.push({
          id: uuidv4(),
          type: category as BlockType,
          title: title,
          content: content.trim(),
        });
      }
    }

    return NextResponse.json(blocks);
  } catch (error: any) {
    console.error("Error loading library:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
