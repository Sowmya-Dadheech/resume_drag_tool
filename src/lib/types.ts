export type BlockType = "header" | "education" | "experience" | "projects" | "skills" | "publications";

export interface LibraryBlock {
  id: string;
  type: BlockType;
  title: string;
  content: string; // The LaTeX snippet for this individual item
}

export interface ResumeProject {
  id: string;
  title: string;
  blocks: LibraryBlock[];
  lastModified: number;
}

export interface Library {
  blocks: LibraryBlock[];
}

export interface AppState {
  library: Library;
  projects: ResumeProject[];
  activeProjectId: string | null;
}
