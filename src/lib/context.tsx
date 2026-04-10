"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState, ResumeProject, LibraryBlock } from "./types";
import { getInitialState, saveState } from "./store";
import { v4 as uuidv4 } from "uuid";

interface AppContextType {
  state: AppState;
  addProject: () => void;
  updateProject: (project: ResumeProject) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string) => void;
  addBlockToProject: (block: LibraryBlock) => void;
  removeBlockFromProject: (blockId: string) => void;
  reorderBlocks: (blocks: LibraryBlock[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children, referenceLatex }: { children: React.ReactNode, referenceLatex?: string }) {
  const [state, setState] = useState<AppState>(() => ({
    library: { blocks: [] },
    projects: [],
    activeProjectId: null,
  }));
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function loadLibrary() {
      try {
        const response = await fetch("/api/library");
        if (!response.ok) throw new Error("Failed to load library");
        const blocks = await response.json();
        
        const initialState = getInitialState();
        setState({
          ...initialState,
          library: { blocks }
        });
        setIsInitialized(true);
      } catch (error) {
        console.error("Error loading library:", error);
        // Fallback to local state if API fails
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

  const addProject = () => {
    const newProject: ResumeProject = {
      id: uuidv4(),
      title: "New Resume",
      blocks: [],
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

  if (!isInitialized) return null;

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
