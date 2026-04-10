"use client";

import React, { useState } from "react";
import { AppProvider, useApp } from "@/lib/context";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import { ResumeEditor } from "@/components/ResumeEditor";
import { Menu, X, Printer, Download } from "lucide-react";
import { clsx } from "clsx";
import { REFERENCE_LATEX } from "@/lib/reference-latex";

function MainContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { state } = useApp();
  const project = state.projects.find(p => p.id === state.activeProjectId);

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-[#0f172a]">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 glass z-30 flex items-center justify-between px-4 lg:hidden">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-white/5 text-slate-400"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-lg font-bold gradient-text truncate max-w-[150px]">
          {project?.title || "ResumeDragger"}
        </span>
        <div className="w-10" />
      </div>

      {/* Sidebar Overlay for Mobile */}
      <div 
        className={clsx(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity lg:hidden",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <ProjectSidebar />
      </div>

      {/* Editor Area */}
      <div className="flex-1 min-w-0 pt-16 lg:pt-0 relative">
        <ResumeEditor />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <AppProvider referenceLatex={REFERENCE_LATEX}>
      <MainContent />
    </AppProvider>
  );
}
