import { AppState, ResumeProject } from "./types";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "resume_dragger_library_v2";

export const getInitialState = (): AppState => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure library structure is preserved but will be refreshed by API
        return {
          ...parsed,
          library: parsed.library || { blocks: [] },
          projects: parsed.projects || [],
          activeProjectId: parsed.activeProjectId || null,
        };
      } catch (e) {
        console.error("Error parsing saved state:", e);
      }
    }
  }

  return {
    library: { blocks: [] },
    projects: [
      {
        id: uuidv4(),
        title: "My Custom Resume",
        blocks: [],
        lastModified: Date.now(),
      },
    ],
    activeProjectId: null,
  };
};

export const saveState = (state: AppState) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};
