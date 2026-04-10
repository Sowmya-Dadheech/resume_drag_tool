"use client";

import React, { useState } from "react";
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
import { FileCode, Printer, Plus, Info, Eye, X } from "lucide-react";
import { generateFullLatex } from "@/lib/latex-parser";
import { DEFAULT_PREAMBLE } from "@/lib/preamble";

export function ResumeEditor() {
  const { state, reorderBlocks, updateProject } = useApp();
  const project = state.projects.find(p => p.id === state.activeProjectId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewPdfId, setPreviewPdfId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 italic space-y-4">
        <div className="p-4 rounded-full bg-white/5">
          <FileCode className="w-12 h-12 opacity-20" />
        </div>
        <p>Select or create a resume to start building</p>
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

  const downloadLatex = async () => {
    setIsGenerating(true);
    try {
      const latex = generateFullLatex(project.blocks, DEFAULT_PREAMBLE);
      const response = await fetch("/api/generate-tex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex, title: project.title }),
      });
      if (!response.ok) throw new Error("Failed to generate TEX");
      const { id } = await response.json();
      window.location.assign(`/api/download/${id}`);
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
      const latex = generateFullLatex(project.blocks, DEFAULT_PREAMBLE);
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex, title: project.title }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const { id } = await response.json();
      window.location.assign(`/api/download/${id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to generate PDF. Check the console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const previewPdf = async () => {
    setIsGenerating(true);
    try {
      const latex = generateFullLatex(project.blocks, DEFAULT_PREAMBLE);
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex, title: project.title }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const { id } = await response.json();
      setPreviewPdfId(id);
    } catch (error) {
      console.error(error);
      alert("Failed to preview PDF. Check the console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#0f172a]">
      {/* Header / Actions */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 glass sticky top-0 z-20">
        <div className="flex items-center gap-4 flex-1">
          <input 
            type="text" 
            value={project.title}
            onChange={(e) => updateProject({ ...project, title: e.target.value })}
            className="bg-transparent text-lg font-bold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-2 transition-all w-full max-w-sm"
            placeholder="Untitled Resume"
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={downloadLatex}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-all"
          >
            <FileCode className="w-4 h-4" />
            <span className="hidden sm:inline">.TEX</span>
          </button>
          
          <button 
            onClick={previewPdf}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm font-medium transition-all shadow-xl shadow-slate-900/30 active:scale-95"
          >
            {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button 
            onClick={downloadPdf}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold transition-all shadow-xl shadow-indigo-600/30 active:scale-95"
          >
            {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Printer className="w-4 h-4" />}
            <span className="hidden lg:inline">{isGenerating ? "Working..." : "Download PDF"}</span>
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-900/30">
        <div className="max-w-4xl mx-auto space-y-4 pb-24">
          {project.blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/5 rounded-2xl text-slate-600 space-y-2">
              <Plus className="w-8 h-8 opacity-50" />
              <p className="text-sm">Drag components from the library to populate your resume</p>
            </div>
          ) : (
            <div className="bg-white/5 p-2 rounded-2xl mb-6 flex items-center gap-3 text-xs text-slate-500 border border-white/5">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>Components are automatically grouped by type (Education → Experience → Projects) in the final PDF.</span>
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
        </div>
      </div>

      {/* PDF Preview Modal */}
      {previewPdfId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full h-full max-w-5xl flex flex-col overflow-hidden shadow-2xl">
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-slate-800">
              <h3 className="text-white font-semibold text-sm sm:text-base">Resume Preview</h3>
              <div className="flex items-center gap-2 sm:gap-4">
                <a 
                  href={`/api/download/${previewPdfId}?inline=true`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-slate-300 hover:text-white transition-colors text-xs font-semibold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open Fullscreen</span>
                </a>
                <a 
                  href={`/api/download/${previewPdfId}`} 
                  download={`${project.title || "resume"}.pdf`}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 rounded-lg text-white transition-colors text-xs font-semibold"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>
                <div className="w-px h-6 bg-white/20 mx-1"></div>
                <button 
                  onClick={() => setPreviewPdfId(null)}
                  className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-lg text-slate-400 transition-colors"
                  title="Close Preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#525659]">
              {/* Added standard PDF viewer background color #525659 */}
              <iframe 
                src={`/api/download/${previewPdfId}?inline=true`} 
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
