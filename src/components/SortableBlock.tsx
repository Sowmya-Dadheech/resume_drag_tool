"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LibraryBlock } from "@/lib/types";
import { GripVertical, Edit2, ChevronDown, ChevronUp, X } from "lucide-react";
import { useApp } from "@/lib/context";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SortableBlockProps {
  block: LibraryBlock;
  projectId: string;
}

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
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 20 : 1,
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

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="group bg-[#1e293b]/50 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md hover:border-white/20 transition-all shadow-lg"
    >
      <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/5">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-white/10 rounded-lg mr-2 transition-colors">
          <GripVertical className="w-4 h-4 text-slate-500" />
        </div>
        
        <div className="flex-1 flex flex-col">
          <input 
            type="text" 
            value={block.title}
            onChange={(e) => handleUpdateTitle(e.target.value)}
            className="bg-transparent font-semibold text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 rounded px-1.5 text-sm w-full truncate"
          />
          <span className="px-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-bold">{block.type}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={clsx(
              "p-1.5 rounded-lg transition-colors",
              isEditing ? "bg-indigo-500/20 text-indigo-400" : "hover:bg-white/10 text-slate-500 hover:text-indigo-400"
            )}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => removeBlockFromProject(block.id)}
            className="p-1.5 hover:bg-red-500/20 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-slate-900/40">
          {isEditing ? (
            <textarea 
              value={block.content}
              onChange={(e) => handleUpdateContent(e.target.value)}
              className="w-full h-48 bg-[#0f172a] border border-white/10 rounded-xl p-4 text-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-y shadow-inner custom-scrollbar"
              placeholder="Enter LaTeX content..."
            />
          ) : (
            <div className="text-slate-400 text-sm whitespace-pre-wrap font-mono line-clamp-4 px-2 italic opacity-80">
              {block.content}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
