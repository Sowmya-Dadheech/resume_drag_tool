"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { 
  Folder, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Trash2, 
  BookOpen, 
  Layers,
  GraduationCap,
  Briefcase,
  Code2,
  Cpu,
  Bookmark
} from "lucide-react";
import { clsx } from "clsx";
import { BlockType } from "@/lib/types";

const TYPE_ICONS: Record<BlockType, any> = {
  header: Layers,
  education: GraduationCap,
  experience: Briefcase,
  projects: Code2,
  skills: Cpu,
  publications: Bookmark
};

export function ProjectSidebar() {
  const { state, addProject, setActiveProject, deleteProject, addBlockToProject, updateProject } = useApp();
  const [expandedLibrary, setExpandedLibrary] = useState<Record<string, boolean>>({
    education: true,
    experience: true,
    projects: true
  });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const toggleLibrary = (type: string) => {
    setExpandedLibrary(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const libraryTypes: BlockType[] = ["education", "experience", "projects", "skills", "publications"];

  return (
    <div className="w-72 h-full flex flex-col glass-dark border-r border-white/10 overflow-hidden shrink-0">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <h1 className="text-xl font-bold gradient-text tracking-tight">ResumeDragger</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-6">
        {/* Library Section */}
        <div>
          <div className="px-3 mb-2 flex items-center gap-2 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
            <BookOpen className="w-3 h-3" />
            Component Library
          </div>
          
          <div className="space-y-1">
            {libraryTypes.map(type => {
              const Icon = TYPE_ICONS[type];
              const blocks = state.library.blocks.filter(b => b.type === type);
              const isExpanded = expandedLibrary[type];
              
              return (
                <div key={type} className="space-y-1">
                  <div 
                    className="flex items-center px-3 py-1.5 rounded-md hover:bg-white/5 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors"
                    onClick={() => toggleLibrary(type)}
                  >
                    {isExpanded ? <ChevronDown className="w-3 h-3 mr-1" /> : <ChevronRight className="w-3 h-3 mr-1" />}
                    <Icon className="w-4 h-4 mr-2 opacity-70" />
                    <span className="text-sm font-medium capitalize">{type}</span>
                    <span className="ml-auto text-[10px] bg-white/5 px-1.5 py-0.5 rounded-full">{blocks.length}</span>
                  </div>
                  
                  {isExpanded && (
                    <div className="ml-6 space-y-0.5 border-l border-white/5 pl-2 py-1">
                      {blocks.map(block => (
                        <div 
                          key={block.id}
                          className="group flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer text-slate-500 hover:text-indigo-300 transition-all"
                          title="Click to add to resume"
                          onClick={() => addBlockToProject(block)}
                        >
                          <span className="text-xs truncate">{block.title}</span>
                          <Plus className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all text-indigo-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumes Section */}
        <div>
          <div className="px-3 mb-2 flex items-center gap-2 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
            <FileText className="w-3 h-3" />
            My Resumes
          </div>
          
          <div className="space-y-1">
            {state.projects.map(p => (
              <div 
                key={p.id}
                className={clsx(
                  "flex items-center group px-3 py-2 rounded-md cursor-pointer transition-all",
                  state.activeProjectId === p.id 
                    ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                    : "hover:bg-white/5 text-slate-400 hover:text-slate-200"
                )}
                onClick={() => setActiveProject(p.id)}
              >
                <div 
                  className="flex items-center flex-1 min-w-0"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingProjectId(p.id);
                  }}
                >
                  <FileText className="w-4 h-4 mr-3 shrink-0" />
                  {editingProjectId === p.id ? (
                    <input
                      type="text"
                      className="bg-slate-800 text-sm font-medium text-white px-1 py-0.5 rounded w-full outline-none focus:ring-1 focus:ring-indigo-500"
                      value={p.title}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateProject({ ...p, title: e.target.value })}
                      onBlur={() => setEditingProjectId(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingProjectId(null);
                        if (e.key === 'Escape') setEditingProjectId(null);
                      }}
                    />
                  ) : (
                    <span className="text-sm font-medium truncate select-none">{p.title}</span>
                  )}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                  className="hidden group-hover:block p-1 hover:bg-red-500/20 rounded ml-2"
                >
                  <Trash2 className="w-3 h-3 text-red-400 opacity-60 hover:opacity-100" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/10 bg-white/5">
        <button 
          onClick={() => addProject()}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Draft
        </button>
      </div>
    </div>
  );
}
