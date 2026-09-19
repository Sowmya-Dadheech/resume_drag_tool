"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/context";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableBlock } from "@/components/SortableBlock";
import { 
  FileCode, 
  Printer, 
  Plus, 
  Info, 
  Eye, 
  X, 
  Copy, 
  Check, 
  LayoutList, 
  Code, 
  Sparkles,
  BarChart3,
  FileCheck
} from "lucide-react";
import { generateFullLatex } from "@/lib/latex-parser";
import { DEFAULT_PREAMBLE } from "@/lib/preamble";
import { clsx } from "clsx";

export function ResumeEditor() {
  const { state, reorderBlocks, updateProject } = useApp();
  const project = state.projects.find(p => p.id === state.activeProjectId);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewPdfId, setPreviewPdfId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"blocks" | "code">("blocks");
  const [copiedCode, setCopiedCode] = useState(false);
  const [rawLatexEdit, setRawLatexEdit] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fullLatexCode = useMemo(() => {
    if (!project) return "";
    return generateFullLatex(project.blocks, DEFAULT_PREAMBLE);
  }, [project]);

  // Clean up blob URL on unmount or when closed
  const closePreview = () => {
    if (previewPdfUrl) {
      URL.revokeObjectURL(previewPdfUrl);
    }
    setPreviewPdfUrl(null);
    setPreviewPdfId(null);
  };

  // Word count & estimated page count
  const resumeStats = useMemo(() => {
    if (!project) return { words: 0, items: 0, pages: 1 };
    const textContent = project.blocks.map(b => b.content).join(" ");
    const cleanText = textContent.replace(/\\(?:[a-zA-Z]+|\S)/g, " ").replace(/[{}]/g, " ");
    const words = cleanText.trim().split(/\s+/).filter(w => w.length > 0).length;
    const items = project.blocks.length;
    
    // ~380 words per tight LaTeX page
    const estimatedPages = words > 420 ? Math.ceil(words / 380 * 10) / 10 : 1;
    return { words, items, pages: estimatedPages };
  }, [project]);

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 italic space-y-4 bg-[#090d16]">
        <div className="p-4 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          <FileCode className="w-12 h-12 text-indigo-400 opacity-60" />
        </div>
        <p className="text-sm font-medium">Select or create a resume to start building</p>
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = project.blocks.findIndex((b) => b.id === active.id);
      const newIndex = project.blocks.findIndex((b) => b.id === over.id);
      reorderBlocks(arrayMove(project.blocks, oldIndex, newIndex));
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fullLatexCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const downloadLatex = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-tex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex: fullLatexCode, title: project.title }),
      });
      if (!response.ok) throw new Error("Failed to generate TEX");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.title || "resume"}.tex`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Failed to download LaTeX code.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPdf = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex: fullLatexCode, title: project.title }),
      });

      if (!response.ok) {
        const resData = await response.json().catch(() => ({}));
        alert(`PDF Generation Failed: ${resData?.error || "Failed to generate PDF"}`);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.title || "resume"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.warn("PDF download network info:", error);
      alert(`Network error during PDF download: ${error?.message || "Unknown error"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const previewPdf = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex: fullLatexCode, title: project.title }),
      });

      if (!response.ok) {
        const resData = await response.json().catch(() => ({}));
        alert(`PDF Preview Info: ${resData?.error || "Failed to generate PDF preview"}`);
        return;
      }

      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(pdfBlob);

      setPreviewPdfUrl(blobUrl);
    } catch (error: any) {
      console.warn("PDF preview network info:", error);
      alert(`Error loading PDF preview: ${error?.message || "Unknown error"}`);
    } finally {
      setIsGenerating(false);
    }
  };



  return (
    <div className="flex-1 h-full flex flex-col bg-[#090d16] text-slate-100 overflow-hidden">
      {/* Header Bar */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <input 
            type="text" 
            value={project.title}
            onChange={(e) => updateProject({ ...project, title: e.target.value })}
            className="bg-transparent text-base font-bold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-lg px-2 py-1 transition-all max-w-sm truncate"
            placeholder="Untitled Resume"
          />

          {/* View Mode Switcher */}
          <div className="hidden md:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setViewMode("blocks")}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                viewMode === "blocks"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <LayoutList className="w-3.5 h-3.5" />
              Canvas
            </button>
            <button
              onClick={() => setViewMode("code")}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                viewMode === "code"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <Code className="w-3.5 h-3.5" />
              LaTeX Code
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {viewMode === "code" && (
            <button 
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? "Copied!" : "Copy Code"}</span>
            </button>
          )}

          <button 
            onClick={downloadLatex}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
            title="Export .TEX source file"
          >
            <FileCode className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">.TEX Source</span>
          </button>
          
          <button 
            onClick={previewPdf}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md active:scale-95 border border-slate-600/50"
          >
            {isGenerating ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Eye className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="hidden sm:inline">Preview PDF</span>
          </button>

          <button 
            onClick={downloadPdf}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 active:scale-95"
          >
            {isGenerating ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Printer className="w-3.5 h-3.5" />}
            <span className="hidden lg:inline">{isGenerating ? "Compiling..." : "Export PDF"}</span>
          </button>
        </div>
      </div>

      {/* Sub-Header Stats Bar */}
      <div className="px-6 py-2 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <b>{resumeStats.items}</b> Blocks Selected
          </span>
          <span className="hidden sm:inline text-slate-700">•</span>
          <span className="hidden sm:flex items-center gap-1.5">
            <b>{resumeStats.words}</b> Words
          </span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1 text-indigo-300 font-semibold">
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            Est. {resumeStats.pages} Page{resumeStats.pages > 1 ? "s" : ""}
          </span>
        </div>

        <div className="text-slate-500 text-[10px]">
          Target: <span className="text-slate-300 font-semibold">Sowmya Dadheech</span>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-4xl mx-auto space-y-4 pb-24">
          {viewMode === "blocks" ? (
            <>
              {project.blocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 space-y-3 bg-slate-900/20">
                  <div className="p-4 rounded-full bg-slate-800/50">
                    <Plus className="w-8 h-8 text-indigo-400 opacity-60" />
                  </div>
                  <p className="text-sm font-semibold text-slate-300">Your resume canvas is empty</p>
                  <p className="text-xs text-slate-500 text-center max-w-sm">
                    Click any component on the left sidebar (Education, Experience, Projects) to add it to this resume draft.
                  </p>
                </div>
              ) : (
                <div className="bg-indigo-950/30 p-3 rounded-2xl mb-4 flex items-center gap-3 text-xs text-indigo-200 border border-indigo-500/20 shadow-sm">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    Drag blocks by their handles to reorder. Items are automatically grouped into clean LaTeX sections during PDF export.
                  </span>
                </div>
              )}
              
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext 
                  items={project.blocks.map(b => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {project.blocks.map((block) => (
                    <SortableBlock key={block.id} block={block} projectId={project.id} />
                  ))}
                </SortableContext>
              </DndContext>
            </>
          ) : (
            /* Raw Code View Mode */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-400" />
                  Generated LaTeX Source Code
                </h3>
                <button 
                  onClick={handleCopyCode}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Copied!" : "Copy Source"}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="w-full h-[650px] overflow-auto p-5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-indigo-200 leading-relaxed custom-scrollbar shadow-2xl">
                  {fullLatexCode}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Preview Modal */}
      {(previewPdfUrl || previewPdfId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full h-full max-w-5xl flex flex-col overflow-hidden shadow-2xl">
            <div className="h-14 border-b border-slate-800 flex items-center justify-between px-5 bg-slate-900">
              <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                Resume PDF Live Preview
              </h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={() => {
                    if (previewPdfUrl) {
                      window.open(previewPdfUrl, "_blank");
                    } else if (previewPdfId) {
                      window.open(`/api/download/${previewPdfId}?inline=true`, "_blank");
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 hover:text-white transition-colors text-xs font-semibold border border-slate-700"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Fullscreen Tab</span>
                </button>
                <a 
                  href={previewPdfUrl || (previewPdfId ? `/api/download/${previewPdfId}` : "#")} 
                  download={`${project.title || "resume"}.pdf`}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-colors text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>
                <div className="w-px h-6 bg-slate-800 mx-1"></div>
                <button 
                  onClick={closePreview}
                  className="p-1.5 hover:bg-rose-500/20 hover:text-rose-400 rounded-xl text-slate-400 transition-colors"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#525659] relative">
              {previewPdfUrl ? (
                <object 
                  data={previewPdfUrl} 
                  type="application/pdf" 
                  className="w-full h-full"
                >
                  <iframe 
                    src={previewPdfUrl} 
                    className="w-full h-full border-0"
                    title="PDF Preview"
                  />
                </object>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-medium">Loading PDF document...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
