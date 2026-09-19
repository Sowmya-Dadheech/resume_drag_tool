"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context";
import { 
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
  Bookmark,
  Search,
  Sparkles,
  X,
  CheckCircle2,
  FilePlus,
  Wand2,
  Code
} from "lucide-react";
import { clsx } from "clsx";
import { BlockType, LibraryBlock } from "@/lib/types";

const TYPE_ICONS: Record<BlockType, any> = {
  header: Layers,
  education: GraduationCap,
  experience: Briefcase,
  projects: Code2,
  skills: Cpu,
  publications: Bookmark
};

// Tag helper for projects
function getProjectBadge(block: LibraryBlock) {
  const t = (block.title + " " + block.content).toLowerCase();
  if (t.includes("rag") || t.includes("llama") || t.includes("langchain")) return { label: "RAG & LLM", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" };
  if (t.includes("vision") || t.includes("unet") || t.includes("mri") || t.includes("segmentation") || t.includes("sam") || t.includes("dit")) return { label: "Vision AI", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" };
  if (t.includes("quant") || t.includes("stock") || t.includes("finbert") || t.includes("sharpe")) return { label: "Finance & Quant", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
  if (t.includes("speech") || t.includes("whisper") || t.includes("asr")) return { label: "Speech & Audio", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" };
  if (t.includes("quantum") || t.includes("qpu") || t.includes("hackathon")) return { label: "Quantum & Bio", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" };
  if (t.includes("rl") || t.includes("isaacgym") || t.includes("flow matching")) return { label: "Robotics & RL", color: "bg-rose-500/20 text-rose-300 border-rose-500/30" };
  if (t.includes("causal") || t.includes("forecast") || t.includes("etl") || t.includes("s3")) return { label: "Data Science", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" };
  return null;
}

export function ProjectSidebar() {
  const { state, addProject, setActiveProject, deleteProject, addBlockToProject, updateProject, addCustomLibraryBlock, resetToDefaultPresets } = useApp();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedLibrary, setExpandedLibrary] = useState<Record<string, boolean>>({
    education: true,
    experience: true,
    projects: true,
    skills: true,
    publications: true
  });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  
  // Add Project Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<"form" | "raw">("form");
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newType, setNewType] = useState<BlockType>("projects");
  const [bullet1, setBullet1] = useState("");
  const [bullet2, setBullet2] = useState("");
  const [bullet3, setBullet3] = useState("");
  const [newContent, setNewContent] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleLibrary = (type: string) => {
    setExpandedLibrary(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const libraryTypes: BlockType[] = ["education", "experience", "projects", "skills", "publications"];

  const filteredBlocks = useMemo(() => {
    return state.library.blocks.filter(block => {
      const matchesSearch = searchQuery === "" || 
        block.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        block.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || block.type === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [state.library.blocks, searchQuery, selectedCategory]);

  const activeProject = state.projects.find(p => p.id === state.activeProjectId);

  const handleAddCustomBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let finalLatex = "";
    if (addMode === "form") {
      const bullets = [bullet1, bullet2, bullet3].filter(b => b.trim());
      finalLatex = `\\item \\textbf{${newTitle.trim()}}`;
      if (newSubtitle.trim()) {
        finalLatex += ` \\hfill \\textit{${newSubtitle.trim()}}`;
      }
      if (bullets.length > 0) {
        finalLatex += `\n\\resumeItemListStart\n`;
        bullets.forEach(b => {
          finalLatex += `  \\resumeItemWithoutTitle{${b.trim()}}\n`;
        });
        finalLatex += `\\resumeItemListEnd`;
      }
    } else {
      finalLatex = newContent.trim();
    }

    if (!finalLatex) return;

    addCustomLibraryBlock(newTitle.trim(), newType, finalLatex);
    
    // Reset form
    setNewTitle("");
    setNewSubtitle("");
    setBullet1("");
    setBullet2("");
    setBullet3("");
    setNewContent("");
    setShowAddModal(false);
    showToast(`Added "${newTitle.trim()}" to project library!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-80 h-full flex flex-col bg-[#0f172a] border-r border-slate-800 overflow-hidden shrink-0 select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              Sowmya's Resume<span className="text-indigo-400">Dragger</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Modular LaTeX Drag & Drop</p>
          </div>
        </div>
      </div>

      {/* Library Search & Filter Bar */}
      <div className="p-3 border-b border-slate-800/80 space-y-2 bg-slate-900/30">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search 26+ projects & experiences..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1">
          {["all", "projects", "experience", "education", "skills", "publications"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                "px-2.5 py-1 rounded-lg text-[10px] font-semibold capitalize whitespace-nowrap transition-all",
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      {/* Scrollable Library & Resumes Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
        {/* Component Library */}
        <div>
          <div className="mb-2 flex items-center justify-between text-slate-400 uppercase text-[10px] font-bold tracking-wider px-1">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              Component Library ({filteredBlocks.length})
            </span>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 text-[10px] bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 px-2 py-0.5 rounded-lg font-bold transition-all shadow-sm active:scale-95"
              title="Add New Project to Bank"
            >
              <Plus className="w-3 h-3" />
              + Add Project
            </button>
          </div>
          
          <div className="space-y-1.5">
            {libraryTypes.map(type => {
              if (selectedCategory !== "all" && selectedCategory !== type) return null;
              
              const Icon = TYPE_ICONS[type];
              const categoryBlocks = filteredBlocks.filter(b => b.type === type);
              const isExpanded = expandedLibrary[type];
              
              return (
                <div key={type} className="space-y-1">
                  <div 
                    className="flex items-center px-2.5 py-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 cursor-pointer text-slate-300 transition-colors border border-white/5"
                    onClick={() => toggleLibrary(type)}
                  >
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5 mr-1 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-500" />}
                    <Icon className="w-3.5 h-3.5 mr-2 text-indigo-400" />
                    <span className="text-xs font-semibold capitalize">{type}</span>
                    <span className="ml-auto text-[10px] bg-slate-700/60 px-1.5 py-0.5 rounded-full text-slate-400 font-mono">
                      {categoryBlocks.length}
                    </span>
                  </div>
                  
                  {isExpanded && (
                    <div className="ml-3 space-y-1 border-l-2 border-indigo-500/20 pl-2 py-1">
                      {categoryBlocks.length === 0 ? (
                        <p className="text-[11px] text-slate-600 italic px-2 py-1">No items match search</p>
                      ) : (
                        categoryBlocks.map(block => {
                          const badge = getProjectBadge(block);
                          const isAlreadyInActive = activeProject?.blocks.some(b => b.title === block.title);

                          return (
                            <div 
                              key={block.id}
                              className={clsx(
                                "group flex flex-col p-2 rounded-lg cursor-pointer transition-all border",
                                isAlreadyInActive
                                  ? "bg-indigo-950/20 border-indigo-500/20 text-slate-300"
                                  : "bg-slate-900/40 hover:bg-slate-800/60 border-transparent hover:border-slate-700/50 text-slate-400 hover:text-slate-200"
                              )}
                              title="Click to add to active resume"
                              onClick={() => {
                                addBlockToProject(block);
                                showToast(`Added "${block.title}" to active resume!`);
                              }}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-medium truncate flex-1 group-hover:text-indigo-300 transition-colors">
                                  {block.title}
                                </span>
                                {isAlreadyInActive ? (
                                  <span title="In active resume"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 opacity-80" /></span>
                                ) : (
                                  <Plus className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                                )}
                              </div>

                              {badge && (
                                <div className="mt-1 flex items-center">
                                  <span className={clsx("text-[9px] font-semibold px-1.5 py-0.2 rounded border", badge.color)}>
                                    {badge.label}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumes Presets Section */}
        <div>
          <div className="mb-2 flex items-center justify-between text-slate-400 uppercase text-[10px] font-bold tracking-wider px-1">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              My Resume Presets ({state.projects.length})
            </span>
            <button
              onClick={() => {
                resetToDefaultPresets();
                showToast("Reset to 1-page standard presets!");
              }}
              className="text-[9px] text-slate-500 hover:text-purple-300 transition-colors font-semibold underline"
              title="Reset presets to 1-page defaults"
            >
              Reset Defaults
            </button>
          </div>
          
          <div className="space-y-1.5">
            {state.projects.map(p => (
              <div 
                key={p.id}
                className={clsx(
                  "flex items-center group px-3 py-2.5 rounded-xl cursor-pointer transition-all border",
                  state.activeProjectId === p.id 
                    ? "bg-indigo-600/20 border-indigo-500/50 text-white shadow-lg shadow-indigo-950/50" 
                    : "bg-slate-900/40 hover:bg-slate-800/50 border-slate-800/60 text-slate-400 hover:text-slate-200"
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
                  <FileText className={clsx("w-4 h-4 mr-2.5 shrink-0", state.activeProjectId === p.id ? "text-indigo-400" : "text-slate-500")} />
                  {editingProjectId === p.id ? (
                    <input
                      type="text"
                      className="bg-slate-800 text-xs font-semibold text-white px-2 py-1 rounded-md w-full outline-none focus:ring-1 focus:ring-indigo-500"
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
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold truncate">{p.title}</span>
                      <span className="text-[10px] text-slate-500">{p.blocks.length} blocks</span>
                    </div>
                  )}
                </div>
                {state.projects.length > 1 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                    className="hidden group-hover:block p-1 hover:bg-rose-500/20 rounded-md text-slate-500 hover:text-rose-400 transition-colors ml-1"
                    title="Delete Preset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/40">
        <button 
          onClick={() => addProject("New Custom Resume")}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          <FilePlus className="w-4 h-4" />
          Create New Resume Draft
        </button>
      </div>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="absolute bottom-16 left-4 right-4 z-30 bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
          <span>{toastMessage}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
        </div>
      )}

      {/* Add New Project / Block Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Add New Project or Component to Bank
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex items-center p-1 bg-slate-800/80 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => setAddMode("form")}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                  addMode === "form" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                )}
              >
                <Wand2 className="w-3.5 h-3.5" />
                Project Form Builder
              </button>
              <button
                type="button"
                onClick={() => setAddMode("raw")}
                className={clsx(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                  addMode === "raw" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                )}
              >
                <Code className="w-3.5 h-3.5" />
                Raw LaTeX Snippet
              </button>
            </div>

            <form onSubmit={handleAddCustomBlock} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project / Component Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Distributed Ray RL Engine"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as BlockType)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="projects">Projects</option>
                  <option value="experience">Experience</option>
                  <option value="education">Education</option>
                  <option value="skills">Skills</option>
                  <option value="publications">Publications</option>
                </select>
              </div>

              {addMode === "form" ? (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subtitle / Tech Stack / Date</label>
                    <input 
                      type="text"
                      placeholder="e.g. PyTorch, CUDA, Ray | Jun 2026"
                      value={newSubtitle}
                      onChange={(e) => setNewSubtitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Description Bullets</label>
                    <input 
                      type="text"
                      placeholder="Bullet 1: Architected a multi-GPU training pipeline..."
                      value={bullet1}
                      onChange={(e) => setBullet1(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input 
                      type="text"
                      placeholder="Bullet 2: Reduced gradient communication latency by 45%..."
                      value={bullet2}
                      onChange={(e) => setBullet2(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input 
                      type="text"
                      placeholder="Bullet 3: Benchmark results..."
                      value={bullet3}
                      onChange={(e) => setBullet3(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">LaTeX Code Snippet</label>
                  <textarea 
                    required
                    rows={5}
                    placeholder={`\\item \\textbf{Project Title} \\hfill \\textit{Tech}\n\\resumeItemListStart\n  \\resumeItemWithoutTitle{Description point...}\n\\resumeItemListEnd`}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  Save & Add to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
