"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState, ResumeProject, LibraryBlock, BlockType } from "./types";
import { getInitialState, saveState } from "./store";
import { v4 as uuidv4 } from "uuid";

interface AppContextType {
  state: AppState;
  addProject: (title?: string, initialBlocks?: LibraryBlock[]) => void;
  updateProject: (project: ResumeProject) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string) => void;
  addBlockToProject: (block: LibraryBlock) => void;
  removeBlockFromProject: (blockId: string) => void;
  reorderBlocks: (blocks: LibraryBlock[]) => void;
  addCustomLibraryBlock: (title: string, type: BlockType, content: string) => void;
  resetToDefaultPresets: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => ({
    library: { blocks: [] },
    projects: [],
    activeProjectId: null,
  }));
  const [isInitialized, setIsInitialized] = useState(false);

  const buildDefaultPresets = (loadedBlocks: LibraryBlock[]): { projects: ResumeProject[]; activeId: string } => {
    const findBlock = (titleKeyword: string) => 
      loadedBlocks.find(b => b.title.toLowerCase().includes(titleKeyword.toLowerCase())) ||
      loadedBlocks.find(b => b.content.toLowerCase().includes(titleKeyword.toLowerCase()));

    const findBlocks = (keywords: string[]) => {
      const results: LibraryBlock[] = [];
      keywords.forEach(kw => {
        const b = findBlock(kw);
        if (b && !results.some(r => r.title === b.title)) {
          results.push({ ...b, id: uuidv4() });
        }
      });
      return results;
    };

    const findSkillBlock = (keyword: string) => {
      const b = loadedBlocks.find(block => block.type === "skills" && block.title.toLowerCase().includes(keyword.toLowerCase()));
      return b ? [{ ...b, id: uuidv4() }] : [];
    };

    const headerBlock = findBlock("Sowmya") || loadedBlocks.find(b => b.type === "header");
    
    // Sort Education reverse-chronological (UW first, Mumbai second)
    const eduOrder = ["University of Washington", "University of Mumbai"];
    const eduBlocks = loadedBlocks
      .filter(b => b.type === "education")
      .sort((a, b) => {
        const idxA = eduOrder.findIndex(k => a.title.includes(k));
        const idxB = eduOrder.findIndex(k => b.title.includes(k));
        return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
      })
      .map(b => ({ ...b, id: uuidv4() }));

    // Sort Experience reverse-chronological (LATEST FIRST!)
    // 1. QBI Lab (Jul 2026 - Present)
    // 2. JAL Trans (Jan - Apr 2025)
    // 3. Jio Platform (Aug - Oct 2024)
    // 4. DJSCE (May - Jul 2024)
    const expOrder = ["QBI Lab", "JAL Trans", "Jio Platform", "DJSCE"];
    const expBlocks = loadedBlocks
      .filter(b => b.type === "experience")
      .sort((a, b) => {
        const idxA = expOrder.findIndex(k => a.title.includes(k));
        const idxB = expOrder.findIndex(k => b.title.includes(k));
        return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
      })
      .map(b => ({ ...b, id: uuidv4() }));

    const pubBlocks = loadedBlocks.filter(b => b.type === "publications").map(b => ({ ...b, id: uuidv4() }));

    // Master Resume: 3 Experiences + 3 Projects + 2 Education + Skills + Publications = 1 PAGE
    const masterProjects = findBlocks([
      "Battery Health",
      "SEC 8-K",
      "CausalSCM"
    ]);

    const p1Id = uuidv4();
    const masterProject: ResumeProject = {
      id: p1Id,
      title: "Sowmya Dadheech - Master Resume (1-Page)",
      blocks: [
        ...(headerBlock ? [{ ...headerBlock, id: uuidv4() }] : []),
        ...eduBlocks,
        ...expBlocks.slice(0, 3),
        ...masterProjects,
        ...findSkillBlock("Technical"),
        ...pubBlocks,
      ],
      lastModified: Date.now(),
    };

    // Agentic AI & LLM / RAG Focus Resume (3 Projects 1-Page)
    const p2Id = uuidv4();
    const ragProject: ResumeProject = {
      id: p2Id,
      title: "Agentic AI & LLM / RAG Focus",
      blocks: [
        ...(headerBlock ? [{ ...headerBlock, id: uuidv4() }] : []),
        ...eduBlocks,
        ...expBlocks.filter(b => b.title.includes("QBI") || b.title.includes("Jio") || b.title.includes("JAL")),
        ...findBlocks(["MultiRAG", "SpecEvoLLM", "AI-Powered Document"]),
        ...findSkillBlock("Agentic"),
      ],
      lastModified: Date.now() - 1000,
    };

    // Data Science & Analytics Focus (3 Projects 1-Page)
    const p3Id = uuidv4();
    const dsProject: ResumeProject = {
      id: p3Id,
      title: "Data Science & Analytics Focus",
      blocks: [
        ...(headerBlock ? [{ ...headerBlock, id: uuidv4() }] : []),
        ...eduBlocks,
        ...expBlocks,
        ...findBlocks(["CausalSCM", "SEC 8-K", "ChronosAdapter"]),
        ...findSkillBlock("Data Science"),
        ...pubBlocks,
      ],
      lastModified: Date.now() - 2000,
    };

    // Data Engineering Focus (3 Projects 1-Page)
    const p4Id = uuidv4();
    const deProject: ResumeProject = {
      id: p4Id,
      title: "Data Engineering Focus",
      blocks: [
        ...(headerBlock ? [{ ...headerBlock, id: uuidv4() }] : []),
        ...eduBlocks,
        ...expBlocks.filter(b => b.title.includes("QBI") || b.title.includes("JAL") || b.title.includes("Jio")),
        ...findBlocks(["CausalSCM", "Battery Health", "SEC 8-K"]),
        ...findSkillBlock("Data Engineering"),
      ],
      lastModified: Date.now() - 3000,
    };

    // NLP & Computational Linguistics Focus (3 Projects 1-Page)
    const p5Id = uuidv4();
    const nlpProject: ResumeProject = {
      id: p5Id,
      title: "NLP & Computational Linguistics Focus",
      blocks: [
        ...(headerBlock ? [{ ...headerBlock, id: uuidv4() }] : []),
        ...eduBlocks,
        ...expBlocks.filter(b => b.title.includes("JAL") || b.title.includes("Jio") || b.title.includes("QBI")),
        ...findBlocks(["Self-Training", "CodeSwitch-ASR", "Custom Vanilla Transformer"]),
        ...findSkillBlock("NLP"),
      ],
      lastModified: Date.now() - 4000,
    };

    // AI & Machine Learning Core Focus (3 Projects 1-Page)
    const p6Id = uuidv4();
    const mlProject: ResumeProject = {
      id: p6Id,
      title: "AI & ML Core Focus",
      blocks: [
        ...(headerBlock ? [{ ...headerBlock, id: uuidv4() }] : []),
        ...eduBlocks,
        ...expBlocks,
        ...findBlocks(["RadSAM", "Medical Semantic", "Autism Detection"]),
        ...findSkillBlock("AI ML"),
        ...pubBlocks,
      ],
      lastModified: Date.now() - 5000,
    };

    return {
      projects: [masterProject, ragProject, dsProject, deProject, nlpProject, mlProject],
      activeId: p1Id,
    };
  };

  useEffect(() => {
    async function loadLibrary() {
      try {
        const response = await fetch("/api/library");
        if (!response.ok) throw new Error("Failed to load library");
        const loadedBlocks: LibraryBlock[] = await response.json();
        
        const savedState = getInitialState();
        
        // Force refresh to apply 4-project 1-page geometry & preset updates
        const needsReset = !savedState.projects || 
          savedState.projects.length < 5 || 
          savedState.projects.some(p => p.blocks.some(b => b.title.includes("Example") || b.title.includes("John Doe"))) ||
          savedState.projects[0]?.blocks.length < 12 ||
          savedState.projects[0]?.blocks.findIndex(b => b.title.includes("DJSCE")) < savedState.projects[0]?.blocks.findIndex(b => b.title.includes("QBI"));

        let initialProjects = savedState.projects.map(p => ({
          ...p,
          blocks: p.blocks.map(b => {
            const fresh = loadedBlocks.find(lb => lb.title === b.title || (lb.type === b.type && lb.title.includes(b.title)));
            return fresh ? { ...b, content: fresh.content } : b;
          })
        }));
        let activeId = savedState.activeProjectId;

        if (needsReset || !initialProjects || initialProjects.length === 0) {
          const defaults = buildDefaultPresets(loadedBlocks);
          initialProjects = defaults.projects;
          activeId = defaults.activeId;
        }

        setState({
          library: { blocks: loadedBlocks },
          projects: initialProjects,
          activeProjectId: activeId || initialProjects[0]?.id || null,
        });
        setIsInitialized(true);
      } catch (error) {
        console.error("Error loading library:", error);
        const initialState = getInitialState();
        setState(initialState);
        setIsInitialized(true);
      }
    }
    loadLibrary();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      saveState(state);
    }
  }, [state, isInitialized]);

  const resetToDefaultPresets = () => {
    const defaults = buildDefaultPresets(state.library.blocks);
    setState(prev => ({
      ...prev,
      projects: defaults.projects,
      activeProjectId: defaults.activeId,
    }));
  };

  const addProject = (title?: string, initialBlocks?: LibraryBlock[]) => {
    const newProject: ResumeProject = {
      id: uuidv4(),
      title: title || "New Custom Resume",
      blocks: initialBlocks || [],
      lastModified: Date.now(),
    };
    setState(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
      activeProjectId: newProject.id,
    }));
  };

  const updateProject = (project: ResumeProject) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => (p.id === project.id ? { ...project, lastModified: Date.now() } : p)),
    }));
  };

  const deleteProject = (id: string) => {
    setState(prev => {
      const remaining = prev.projects.filter(p => p.id !== id);
      return {
        ...prev,
        projects: remaining,
        activeProjectId: prev.activeProjectId === id ? (remaining[0]?.id || null) : prev.activeProjectId,
      };
    });
  };

  const setActiveProject = (id: string) => {
    setState(prev => ({ ...prev, activeProjectId: id }));
  };

  const addBlockToProject = (block: LibraryBlock) => {
    setState(prev => {
      const project = prev.projects.find(p => p.id === prev.activeProjectId);
      if (!project) return prev;
      return {
        ...prev,
        projects: prev.projects.map(p => 
          p.id === project.id 
          ? { ...p, blocks: [...p.blocks, { ...block, id: uuidv4() }], lastModified: Date.now() } 
          : p
        ),
      };
    });
  };

  const removeBlockFromProject = (blockId: string) => {
    setState(prev => {
      const project = prev.projects.find(p => p.id === prev.activeProjectId);
      if (!project) return prev;
      return {
        ...prev,
        projects: prev.projects.map(p => 
          p.id === project.id 
          ? { ...p, blocks: p.blocks.filter(b => b.id !== blockId), lastModified: Date.now() } 
          : p
        ),
      };
    });
  };

  const reorderBlocks = (blocks: LibraryBlock[]) => {
    setState(prev => {
      const project = prev.projects.find(p => p.id === prev.activeProjectId);
      if (!project) return prev;
      return {
        ...prev,
        projects: prev.projects.map(p => 
          p.id === project.id ? { ...p, blocks, lastModified: Date.now() } : p
        ),
      };
    });
  };

  const addCustomLibraryBlock = (title: string, type: BlockType, content: string) => {
    const newBlock: LibraryBlock = {
      id: uuidv4(),
      title,
      type,
      content,
    };
    setState(prev => ({
      ...prev,
      library: {
        blocks: [newBlock, ...prev.library.blocks],
      },
    }));
    addBlockToProject(newBlock);
  };

  if (!isInitialized) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#0f172a] text-slate-300 space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-wide">Loading Sowmya's Resume Dragger...</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      state,
      addProject,
      updateProject,
      deleteProject,
      setActiveProject,
      addBlockToProject,
      removeBlockFromProject,
      reorderBlocks,
      addCustomLibraryBlock,
      resetToDefaultPresets,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
