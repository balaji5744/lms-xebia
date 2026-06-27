import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Trash2,
  FileText,
  Code as CodeIcon,
  Video as VideoIcon,
  Loader2,
  AlertCircle,
  HelpCircle,
  ChevronLeft,
  BookOpen,
  ArrowRight,
  Code2,
  Sparkles,
  Layers,
} from "lucide-react";
import { Module, Submodule, ContentBlock } from "../../types";
import contentService from "../../services/contentService";

interface WizardStep3Props {
  courseData: any;
  setCourseData: (val: any) => void;
  activeSubmoduleId: number | null;
  setActiveSubmoduleId: (id: number | null) => void;
}

export const WizardStep3: React.FC<WizardStep3Props> = ({
  courseData,
  setCourseData,
  activeSubmoduleId,
  setActiveSubmoduleId,
}) => {
  const queryClient = useQueryClient();
  const modules: Module[] = courseData.modules || [];

  // Flat list of all submodules in the course for reference/quick selector
  const allSubmodules = useMemo(() => {
    const list: {
      id: number;
      title: string;
      moduleId: number;
      moduleTitle: string;
    }[] = [];
    modules.forEach((mod) => {
      (mod.submodules || []).forEach((sub) => {
        if (sub.id !== undefined && mod.id !== undefined) {
          list.push({
            id: sub.id,
            title: sub.title,
            moduleId: mod.id,
            moduleTitle: mod.title,
          });
        }
      });
    });
    return list;
  }, [modules]);

  // Determine active submodule details
  const activeSubmodule = useMemo(() => {
    if (!activeSubmoduleId) return null;
    return allSubmodules.find((sub) => sub.id === activeSubmoduleId) || null;
  }, [activeSubmoduleId, allSubmodules]);

  // Form states for creating a new block
  const [selectedType, setSelectedType] = useState<"text" | "video" | "code">(
    "text",
  );

  // Specific fields
  const [textVal, setTextVal] = useState("");
  const [codeVal, setCodeVal] = useState("");
  const [codeLang, setCodeLang] = useState("JavaScript");
  const [videoUrlVal, setVideoUrlVal] = useState("");
  const [videoCaptionVal, setVideoCaptionVal] = useState("");

  // 1. Query: Fetch all content blocks for active submodule
  const {
    data: fetchedBlocks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ContentBlock[], Error>({
    queryKey: ["submoduleContents", activeSubmoduleId],
    queryFn: () => contentService.getContentBySubmodule(activeSubmoduleId!),
    enabled: !!activeSubmoduleId,
  });

  // Keep parent draft state's contentBlocks inside courseData updated when fetchedBlocks changes
  useEffect(() => {
    if (activeSubmodule && fetchedBlocks) {
      setCourseData((prev: any) => {
        const updatedModules = (prev.modules || []).map((m: any) => {
          if (m.id === activeSubmodule.moduleId) {
            return {
              ...m,
              submodules: (m.submodules || []).map((s: any) => {
                if (s.id === activeSubmodule.id) {
                  return { ...s, contentBlocks: fetchedBlocks };
                }
                return s;
              }),
            };
          }
          return m;
        });
        return { ...prev, modules: updatedModules };
      });
    }
  }, [fetchedBlocks, activeSubmodule, setCourseData]);

  // Sort blocks by contentOrder (ascending)
  const sortedBlocks = useMemo(() => {
    if (!fetchedBlocks) return [];
    return [...fetchedBlocks].sort((a, b) => {
      const orderA = a.contentOrder ?? 0;
      const orderB = b.contentOrder ?? 0;
      return orderA - orderB;
    });
  }, [fetchedBlocks]);

  // 2. Mutation: Create Content Block
  const createBlockMutation = useMutation({
    mutationFn: (newBlock: Partial<ContentBlock>) =>
      contentService.createContent(activeSubmoduleId!, newBlock),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["submoduleContents", activeSubmoduleId],
      });
      // Reset input fields
      setTextVal("");
      setCodeVal("");
      setVideoUrlVal("");
      setVideoCaptionVal("");
    },
    onError: (err: any) => {
      console.error("[WizardStep3] Error creating content block:", err);
      alert(
        "Failed to save block. Please check that Spring Boot server is online at port 8080.",
      );
    },
  });

  // 3. Mutation: Delete Content Block
  const deleteBlockMutation = useMutation({
    mutationFn: (contentId: number) =>
      contentService.deleteContent(activeSubmoduleId!, contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["submoduleContents", activeSubmoduleId],
      });
    },
    onError: (err: any) => {
      console.error("[WizardStep3] Error deleting content block:", err);
    },
  });

  const handleAddBlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmoduleId) return;

    // Validate based on selected type
    if (selectedType === "text" && !textVal.trim()) {
      alert("Please fill in the Text block body.");
      return;
    }
    if (selectedType === "code" && !codeVal.trim()) {
      alert("Please fill in the Code script body.");
      return;
    }
    if (selectedType === "video" && !videoUrlVal.trim()) {
      alert("Please enter a valid Video link.");
      return;
    }

    const nextOrder = sortedBlocks.length + 1;

    // Build the new block payload with both modern and backward compatible fields
    const payload: Partial<ContentBlock> = {
      type: selectedType,
      title: `${selectedType.toUpperCase()} Block ${nextOrder}`,
      contentOrder: nextOrder,
      isActive: true,

      // Modern database schema fields
      text: selectedType === "text" ? textVal.trim() : undefined,
      code: selectedType === "code" ? codeVal.trim() : undefined,
      language: selectedType === "code" ? codeLang : undefined,
      videoUrl: selectedType === "video" ? videoUrlVal.trim() : undefined,
      caption: selectedType === "video" ? videoCaptionVal.trim() : undefined,

      // Backward compatible fields for other preview renderers
      value:
        selectedType === "text"
          ? textVal.trim()
          : selectedType === "code"
            ? codeVal.trim()
            : videoUrlVal.trim(),
      metadata: {
        language: selectedType === "code" ? codeLang : undefined,
        videoUrl: selectedType === "video" ? videoUrlVal.trim() : undefined,
        caption: selectedType === "video" ? videoCaptionVal.trim() : undefined,
      },
    };

    createBlockMutation.mutate(payload);
  };

  // 1. EMPTY STATE RENDERING
  if (!activeSubmoduleId) {
    return (
      <div className="py-12 text-center max-w-xl mx-auto space-y-6 animate-fade-in">
        <div className="w-16 h-16 bg-[#510047]/5 rounded-2xl flex items-center justify-center mx-auto text-[#510047] animate-bounce">
          <BookOpen className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            No Active Submodule Selected
          </h3>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Content blocks are configured at the{" "}
            <strong>Submodule (lesson)</strong> tier. Go back to Step 2 and
            click{" "}
            <span className="font-semibold text-[#01AC9F]">"Write Lesson"</span>{" "}
            on any curriculum submodule block to initialize this content
            composer.
          </p>
        </div>

        {allSubmodules.length > 0 && (
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl space-y-3">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Quick Select Available Submodules
            </p>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {allSubmodules.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubmoduleId(sub.id)}
                  className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-[#510047] hover:bg-[#510047]/5 transition-all text-xs font-semibold text-gray-700 flex justify-between items-center group cursor-pointer"
                >
                  <span className="truncate max-w-[80%]">{sub.title}</span>
                  <span className="text-[10px] text-gray-400 font-normal italic shrink-0 group-hover:text-[#510047]">
                    {sub.moduleTitle} &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. ACTIVE EDITOR STATE
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Submodule context breadcrumb header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 font-mono">
            <span>CURRICULUM MODULE</span>
            <span>&bull;</span>
            <span className="text-gray-500">
              {activeSubmodule?.moduleTitle}
            </span>
          </div>
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#510047] shrink-0" />
            Active Submodule Lesson:{" "}
            <span className="text-[#510047]">{activeSubmodule?.title}</span>
          </h2>
        </div>

        {allSubmodules.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
              Switch Lesson:
            </label>
            <select
              value={activeSubmoduleId ?? ""}
              onChange={(e) =>
                setActiveSubmoduleId(parseInt(e.target.value, 10))
              }
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 font-semibold focus:outline-none focus:border-[#510047] cursor-pointer"
            >
              {allSubmodules.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.title} ({sub.moduleTitle})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LEFT COLUMN: ACTIVE BLOCK LIST (NOTION-LIKE STACK) */}
        <div className="xl:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-gray-400" />
              Content Blocks ({sortedBlocks.length})
            </h3>
            <span className="text-[10px] font-mono text-gray-400">
              Order strictly sequential
            </span>
          </div>

          {isLoading ? (
            <div className="py-20 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-500">
              <Loader2 className="w-6 h-6 text-[#510047] animate-spin" />
              <p className="text-xs">Fetching submodule blocks...</p>
            </div>
          ) : isError ? (
            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-800">
                Connection Interrupted
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                {error?.message || "Failed to fetch blocks"}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-3 px-3 py-1 bg-white border border-gray-200 text-xs font-semibold rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : sortedBlocks.length === 0 ? (
            <div className="py-16 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 flex flex-col items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-300 mb-2 animate-pulse" />
              <p className="text-xs font-semibold text-gray-600">
                Lesson Canvas is Blank
              </p>
              <p className="text-[10px] text-gray-400 mt-1 max-w-xs">
                Introduce reading material, code structures, or embedded
                instructional videos using the block generator.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedBlocks.map((block, idx) => {
                const bType = block.type || "text";

                return (
                  <div
                    key={block.id ?? `temp-b-${idx}`}
                    className="group border border-gray-100 hover:border-gray-200 rounded-2xl bg-white p-5 shadow-sm hover:shadow transition-all relative flex gap-4"
                  >
                    {/* ContentOrder Ribbon */}
                    <div className="absolute left-3 top-3 text-[10px] font-bold text-gray-300 font-mono">
                      #{block.contentOrder ?? idx + 1}
                    </div>

                    {/* Block Icon / Type signifier */}
                    <div className="pt-1.5">
                      {bType === "text" && (
                        <div className="w-8 h-8 rounded-lg bg-[#510047]/5 text-[#510047] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                      )}
                      {bType === "code" && (
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                          <CodeIcon className="w-4 h-4" />
                        </div>
                      )}
                      {bType === "video" && (
                        <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                          <VideoIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Block content description preview */}
                    <div className="flex-1 min-w-0 pr-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                          {bType} block
                        </span>
                        {bType === "code" && (
                          <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-mono font-bold">
                            {block.language ||
                              block.metadata?.language ||
                              "Code"}
                          </span>
                        )}
                      </div>

                      {/* Display content body */}
                      {bType === "text" && (
                        <p className="text-xs text-gray-700 leading-relaxed font-sans line-clamp-3 bg-gray-50/50 p-2.5 rounded-lg border border-gray-100">
                          {block.text || block.value}
                        </p>
                      )}

                      {bType === "code" && (
                        <div className="bg-gray-900 text-gray-200 rounded-xl p-3 font-mono text-[10px] overflow-x-auto border border-gray-800 leading-normal max-h-36 line-clamp-4 select-all">
                          {block.code || block.value}
                        </div>
                      )}

                      {bType === "video" && (
                        <div className="bg-rose-50/30 border border-rose-100/50 rounded-xl p-3 flex items-center gap-3">
                          <div className="w-10 h-7 bg-rose-100 rounded flex items-center justify-center text-rose-600 shrink-0">
                            <VideoIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">
                              {block.caption ||
                                block.metadata?.caption ||
                                "Instructional Video Clip"}
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono truncate">
                              {block.videoUrl || block.metadata?.videoUrl}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Operations Button panel */}
                    <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this content block?",
                            )
                          ) {
                            deleteBlockMutation.mutate(block.id!);
                          }
                        }}
                        disabled={deleteBlockMutation.isPending}
                        className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Content Block"
                      >
                        {deleteBlockMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: COMPOSER BOX FOR NEW BLOCKS */}
        <div className="xl:col-span-5">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 sticky top-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-[#510047] uppercase tracking-wider">
                Block Composer Panel
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">
                Select a type, populate its curriculum details, and append it
                directly to the active lesson list.
              </p>
            </div>

            {/* Block Type Selection tabs */}
            <div className="grid grid-cols-3 gap-1 bg-gray-200/50 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedType("text")}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedType === "text"
                    ? "bg-[#510047] text-white shadow-sm"
                    : "text-gray-500 hover:bg-white/50 hover:text-gray-800"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Text
              </button>

              <button
                type="button"
                onClick={() => setSelectedType("video")}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedType === "video"
                    ? "bg-[#510047] text-white shadow-sm"
                    : "text-gray-500 hover:bg-white/50 hover:text-gray-800"
                }`}
              >
                <VideoIcon className="w-3.5 h-3.5" />
                Video
              </button>

              <button
                type="button"
                onClick={() => setSelectedType("code")}
                className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedType === "code"
                    ? "bg-[#510047] text-white shadow-sm"
                    : "text-gray-500 hover:bg-white/50 hover:text-gray-800"
                }`}
              >
                <CodeIcon className="w-3.5 h-3.5" />
                Code
              </button>
            </div>

            {/* Active Fields Forms */}
            <form onSubmit={handleAddBlockSubmit} className="space-y-4">
              {/* Text Block Inputs */}
              {selectedType === "text" && (
                <div className="space-y-2 animate-fade-in">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Text Body / Paragraph
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Enter descriptive program training materials, explanations, bullets, or steps..."
                    value={textVal}
                    onChange={(e) => setTextVal(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0] transition-all resize-none text-gray-700 leading-relaxed font-sans"
                  />
                </div>
              )}

              {/* Video Block Inputs */}
              {selectedType === "video" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Video Stream URL
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      value={videoUrlVal}
                      onChange={(e) => setVideoUrlVal(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0] transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Video Title / Caption
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Project Setup Walkthrough"
                      value={videoCaptionVal}
                      onChange={(e) => setVideoCaptionVal(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Code Block Inputs */}
              {selectedType === "code" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Programming Language
                      </label>
                      <select
                        value={codeLang}
                        onChange={(e) => setCodeLang(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#510047] text-gray-700 font-semibold cursor-pointer"
                      >
                        <option value="JavaScript">JavaScript</option>
                        <option value="TypeScript">TypeScript</option>
                        <option value="Python">Python</option>
                        <option value="Java">Java</option>
                        <option value="HTML">HTML</option>
                        <option value="CSS">CSS</option>
                        <option value="SQL">SQL</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Code Script Body
                    </label>
                    <textarea
                      rows={6}
                      required
                      placeholder="// Enter script segment here..."
                      value={codeVal}
                      onChange={(e) => setCodeVal(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-indigo-500 transition-all resize-none text-gray-200 font-mono leading-normal"
                    />
                  </div>
                </div>
              )}

              {/* Submission CTA Button */}
              <button
                type="submit"
                disabled={createBlockMutation.isPending}
                className="w-full py-2.5 bg-[#01AC9F] hover:bg-[#008f84] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {createBlockMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Appending Block...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Content Block</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
