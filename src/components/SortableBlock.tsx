"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LibraryBlock } from "@/lib/types";
import { GripVertical, Edit2, ChevronDown, ChevronUp, X, Check, Code, Eye } from "lucide-react";
import { useApp } from "@/lib/context";
import { clsx } from "clsx";

interface SortableBlockProps {
  block: LibraryBlock;
  projectId: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  header: "bg-slate-700/50 text-slate-300 border-slate-600/40",
  education: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  experience: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  projects: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  skills: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  publications: "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

export function SortableBlock({ block, projectId }: SortableBlockProps) {
  const { state, updateProject, removeBlockFromProject } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 30 : 1,
  };

  const handleUpdateContent = (newContent: string) => {
    const project = state.projects.find(p => p.id === projectId);
    if (!project) return;
    const newBlocks = project.blocks.map(b => b.id === block.id ? { ...b, content: newContent } : b);
    updateProject({ ...project, blocks: newBlocks });
  };

  const handleUpdateTitle = (newTitle: string) => {
    const project = state.projects.find(p => p.id === projectId);
    if (!project) return;
    const newBlocks = project.blocks.map(b => b.id === block.id ? { ...b, title: newTitle } : b);
    updateProject({ ...project, blocks: newBlocks });
  };

  const catColor = CATEGORY_COLORS[block.type] || "bg-slate-800 text-slate-300 border-slate-700";

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={clsx(
        "group bg-slate-900/60 border rounded-2xl overflow-hidden backdrop-blur-md transition-all shadow-lg",
        isDragging ? "border-indigo-500 ring-2 ring-indigo-500/30 shadow-2xl" : "border-slate-800/80 hover:border-slate-700"
      )}
    >
      {/* Block Header Bar */}
      <div className="flex items-center px-4 py-3 bg-slate-900/80 border-b border-slate-800/80">
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-800 rounded-lg mr-2 transition-colors text-slate-500 hover:text-slate-300"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        <div className="flex-1 flex items-center gap-2 min-w-0 mr-2">
          <input 
            type="text" 
            value={block.title}
            onChange={(e) => handleUpdateTitle(e.target.value)}
            className="bg-transparent font-bold text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/60 rounded px-1.5 py-0.5 text-xs sm:text-sm w-full truncate hover:bg-slate-800/40 transition-colors"
            placeholder="Item Title"
          />
          <span className={clsx("text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0", catColor)}>
            {block.type}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={clsx(
              "p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 font-semibold",
              isEditing ? "bg-indigo-600 text-white" : "hover:bg-slate-800 text-slate-400 hover:text-indigo-400"
            )}
            title="Edit LaTeX content"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={() => removeBlockFromProject(block.id)}
            className="p-1.5 hover:bg-rose-500/20 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
            title="Remove block from resume"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Block Body */}
      {isExpanded && (
        <div className="p-4 bg-slate-950/40">
          {isEditing ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold px-1">
                <span className="flex items-center gap-1">
                  <Code className="w-3 h-3 text-indigo-400" />
                  Edit LaTeX Snippet
                </span>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Done
                </button>
              </div>
              <textarea 
                value={block.content}
                onChange={(e) => handleUpdateContent(e.target.value)}
                className="w-full h-44 bg-[#090d16] border border-slate-800 rounded-xl p-3.5 text-indigo-200 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/60 resize-y shadow-inner custom-scrollbar leading-relaxed"
                placeholder="Enter LaTeX code snippet..."
              />
            </div>
          ) : (
            <div className="text-slate-300 text-xs font-mono leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-900/60 whitespace-pre-wrap font-medium">
              {block.content}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
