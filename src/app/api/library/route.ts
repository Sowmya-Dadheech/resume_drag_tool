import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { LibraryBlock, BlockType } from "@/lib/types";

export async function GET() {
  try {
    const libraryDir = path.join(process.cwd(), "src/lib/data/library");
    const categories: (BlockType | "header")[] = ["header", "education", "experience", "projects", "skills", "publications"];
    const blocks: LibraryBlock[] = [];

    for (const category of categories) {
      const categoryPath = path.join(libraryDir, category);
      if (!fs.existsSync(categoryPath)) continue;

      const files = fs.readdirSync(categoryPath);
      for (const file of files) {
        if (!file.endsWith(".tex")) continue;

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
