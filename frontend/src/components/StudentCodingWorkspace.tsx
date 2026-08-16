import React, { useState, useEffect, useMemo } from "react";
import Editor from "@monaco-editor/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Code,
  Terminal,
  History,
  Play,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Loader2,
  XCircle,
  Clock,
  Cpu,
  CornerDownRight,
} from "lucide-react";
import { CodingProblem, RunResponse, SubmissionResponse } from "../types";
import codingService from "../services/codingService";

interface StudentCodingWorkspaceProps {
  problemId: number;
  onBack: () => void;
}

export const StudentCodingWorkspace: React.FC<StudentCodingWorkspaceProps> = ({
  problemId,
  onBack,
}) => {
  const [selectedLang, setSelectedLang] = useState<string>("java");
  const [codeValue, setCodeValue] = useState<string>("");
  const [activeConsoleTab, setActiveConsoleTab] = useState<"results" | "history">("results");
  const [isCopied, setIsCopied] = useState(false);

  // Student identifier mock fallback (standard for local/MVP)
  const studentId = "student-2026";

  // 1. Fetch Coding Problem details
  const { data: problem, isLoading, isError, error, refetch } = useQuery<CodingProblem, Error>({
    queryKey: ["codingProblemDetails", problemId],
    queryFn: () => codingService.getProblemDetails(problemId),
    enabled: !!problemId,
  });

  // Allowed languages list based on available starter codes or default
  const allowedLanguages = useMemo(() => {
    if (!problem?.starterCodes || problem.starterCodes.length === 0) {
      return ["java", "python", "cpp", "c"];
    }
    return problem.starterCodes.map(sc => sc.language.toLowerCase());
  }, [problem]);

  // Set default language and starter code when problem loads
  useEffect(() => {
    if (allowedLanguages.length > 0) {
      const defaultLang = allowedLanguages.includes("java") ? "java" : allowedLanguages[0];
      setSelectedLang(defaultLang);
    }
  }, [allowedLanguages]);

  // Map starter code templates
  const starterCodeMap = useMemo(() => {
    const map: Record<string, string> = {
      java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n        System.out.println("Hello World");\n    }\n}`,
      python: `# Write your solution here\nimport sys\n\ndef main():\n    print("Hello World")\n\nif __name__ == '__main__':\n    main()`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    cout << "Hello World" << endl;\n    return 0;\n}`,
      c: `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    printf("Hello World\\n");\n    return 0;\n}`,
    };

    if (problem?.starterCodes) {
      problem.starterCodes.forEach((sc) => {
        map[sc.language.toLowerCase()] = sc.code;
      });
    }
    return map;
  }, [problem]);

  // Update editor value when language changes
  useEffect(() => {
    setCodeValue(starterCodeMap[selectedLang] || "");
  }, [selectedLang, starterCodeMap]);

  // Reset editor template
  const handleResetCode = () => {
    if (window.confirm("Are you sure you want to reset the editor to the starter template?")) {
      setCodeValue(starterCodeMap[selectedLang] || "");
    }
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeValue);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 2. Fetch Submission History Query
  const { data: submissions = [], refetch: refetchSubmissions } = useQuery<SubmissionResponse[], Error>({
    queryKey: ["submissionHistory", problemId, studentId],
    queryFn: () => codingService.getSubmissions(problemId, studentId),
    enabled: !!problemId,
  });

  // 3. Mutation: Run Code
  const runCodeMutation = useMutation<RunResponse, Error, { lang: string; code: string }>({
    mutationFn: ({ lang, code }) => codingService.runCode(problemId, lang, code),
    onSuccess: () => {
      setActiveConsoleTab("results");
    },
    onError: (err) => {
      console.error("Run code error:", err);
      alert("Failed to run code: " + err.message);
    },
  });

  // 4. Mutation: Submit Solution
  const submitSolutionMutation = useMutation<SubmissionResponse, Error, { lang: string; code: string }>({
    mutationFn: ({ lang, code }) => codingService.submitSolution(problemId, studentId, lang, code),
    onSuccess: () => {
      setActiveConsoleTab("results");
      refetchSubmissions();
    },
    onError: (err) => {
      console.error("Submit solution error:", err);
      alert("Failed to submit solution: " + err.message);
    },
  });

  const handleRunCode = () => {
    runCodeMutation.mutate({ lang: selectedLang, code: codeValue });
  };

  const handleSubmitSolution = () => {
    submitSolutionMutation.mutate({ lang: selectedLang, code: codeValue });
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center gap-3 text-gray-500 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
        <Loader2 className="w-10 h-10 text-[#510047] animate-spin" />
        <p className="text-xs font-semibold text-gray-700">Loading code editor workspace...</p>
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="py-24 text-center bg-white border border-gray-100 rounded-3xl max-w-xl mx-auto shadow-sm space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <div>
          <h3 className="text-lg font-bold text-gray-800">Connection Failed</h3>
          <p className="text-xs text-gray-400 mt-2">{error?.message || "Failed to load coding problem details."}</p>
        </div>
        <div className="flex justify-center gap-3">
          <button onClick={onBack} className="px-4 py-2 border border-gray-200 text-xs font-bold rounded-xl text-gray-700 hover:bg-gray-50">Back</button>
          <button onClick={() => refetch()} className="px-4 py-2 bg-[#01AC9F] text-white text-xs font-bold rounded-xl">Retry</button>
        </div>
      </div>
    );
  }

  // Determine language mode for Monaco editor
  const getMonacoLanguage = (lang: string) => {
    if (lang === "cpp" || lang === "c") return "cpp";
    return lang;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px] animate-fade-in">
      
      {/* LEFT COLUMN: Problem Details (Pre-split: 5 cols) */}
      <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        
        {/* Workspace Back Header */}
        <div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between shrink-0">
          <button
            onClick={onBack}
            className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1.5 cursor-pointer"
          >
            &larr; Back to Submodule
          </button>
          <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-mono font-bold">
            Max Points: {problem.points}
          </span>
        </div>

        {/* Problem Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span
                className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-white ${
                  problem.difficulty === "Easy"
                    ? "bg-emerald-500"
                    : problem.difficulty === "Medium"
                      ? "bg-blue-500"
                      : "bg-amber-500"
                }`}
              >
                {problem.difficulty}
              </span>
              <h2 className="text-base font-black text-[#510047] tracking-tight">
                {problem.slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </h2>
            </div>
            <p className="text-[11px] text-gray-400 font-medium">
              Time Limit: {problem.timeLimit} ms | Memory Limit: {problem.memoryLimit} MB
            </p>
          </div>

          <div className="w-full border-t border-gray-50" />

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Problem Statement</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans whitespace-pre-wrap">
              {problem.description}
            </p>
          </div>

          {/* I/O Format */}
          {problem.inputFormat && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Input Format</h4>
              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100/50 whitespace-pre-wrap">
                {problem.inputFormat}
              </p>
            </div>
          )}

          {problem.outputFormat && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Output Format</h4>
              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100/50 whitespace-pre-wrap">
                {problem.outputFormat}
              </p>
            </div>
          )}

          {/* Constraints */}
          {problem.constraints && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Constraints</h4>
              <pre className="text-[10px] text-gray-600 font-mono bg-gray-50 p-3 rounded-xl border border-gray-100/50 leading-normal">
                {problem.constraints}
              </pre>
            </div>
          )}

          {/* Public Examples */}
          {problem.testCases && problem.testCases.filter(t => !t.isHidden).length > 0 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Public Examples</h4>
              {problem.testCases.filter(t => !t.isHidden).map((tc, idx) => (
                <div key={tc.id ?? idx} className="space-y-2.5 bg-gray-900 text-gray-200 p-4 rounded-xl border border-gray-800 font-mono text-[10px]">
                  <div className="text-[9px] font-bold text-gray-400 border-b border-gray-800 pb-1.5 uppercase">
                    Example #{idx + 1}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#01AC9F] font-bold">Input:</span>
                    <pre className="text-gray-300 whitespace-pre">{tc.input}</pre>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#01AC9F] font-bold">Expected Output:</span>
                    <pre className="text-gray-300 whitespace-pre">{tc.expectedOutput}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Explanation */}
          {problem.explanation && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Explanation</h4>
              <p className="text-xs text-gray-600 leading-relaxed bg-indigo-50/20 p-3.5 rounded-xl border border-indigo-50/50 font-sans">
                {problem.explanation}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Code Editor + Console Panel (Pre-split: 7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        
        {/* Editor Wrapper Container */}
        <div className="flex-1 bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          {/* Editor Header Bar */}
          <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-200">Editor Engine</span>
                <span className="text-[9px] text-gray-500 block leading-none mt-0.5">Monaco Sandbox V4</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1 text-xs text-gray-200 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {allowedLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>

              {/* Reset Code */}
              <button
                onClick={handleResetCode}
                title="Reset to Template"
                className="p-1.5 bg-gray-800 border border-gray-700 hover:border-red-500/50 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Copy Code */}
              <button
                onClick={handleCopyCode}
                title="Copy Code"
                className="p-1.5 bg-gray-800 border border-gray-700 hover:border-indigo-500/50 hover:bg-indigo-500/10 rounded-lg text-gray-400 hover:text-indigo-400 transition-colors cursor-pointer flex items-center justify-center"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Monaco Editor Pane */}
          <div className="flex-1 min-h-[300px]">
            <Editor
              height="100%"
              language={getMonacoLanguage(selectedLang)}
              value={codeValue}
              onChange={(value) => setCodeValue(value || "")}
              theme="vs-dark"
              options={{
                fontSize: 12,
                fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
                minimap: { enabled: false },
                lineNumbers: "on",
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
              }}
            />
          </div>
        </div>

        {/* Console / Output Panel Drawer */}
        <div className="h-64 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col shrink-0">
          {/* Console Header Tabs */}
          <div className="bg-gray-50 border-b border-gray-100 px-4 py-2 flex items-center justify-between shrink-0 select-none">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveConsoleTab("results")}
                className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeConsoleTab === "results"
                    ? "bg-[#510047] text-white"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Console Panel
              </button>
              <button
                onClick={() => setActiveConsoleTab("history")}
                className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeConsoleTab === "history"
                    ? "bg-[#510047] text-white"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Submission History ({submissions.length})
              </button>
            </div>

            {/* Run / Submit CTA Triggers */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunCode}
                disabled={runCodeMutation.isPending || submitSolutionMutation.isPending}
                className="px-3.5 py-1.5 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
              >
                {runCodeMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin text-[#01AC9F]" />
                ) : (
                  <Play className="w-3 h-3 text-[#01AC9F] fill-current" />
                )}
                Run Code
              </button>
              <button
                onClick={handleSubmitSolution}
                disabled={runCodeMutation.isPending || submitSolutionMutation.isPending}
                className="px-4 py-1.5 bg-[#01AC9F] hover:bg-[#008f84] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow transition-all disabled:opacity-50 cursor-pointer active:scale-95"
              >
                {submitSolutionMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin text-white" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ffd7f0]" />
                )}
                Submit Code
              </button>
            </div>
          </div>

          {/* Console Content Box */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            {activeConsoleTab === "results" ? (
              <div className="space-y-4">
                {/* 1. Loading indicators */}
                {runCodeMutation.isPending && (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-gray-400">
                     <Loader2 className="w-6 h-6 animate-spin text-[#01AC9F]" />
                     <p className="text-[10px] font-semibold text-gray-500">Compiling and executing public examples inside isolated sandbox...</p>
                  </div>
                )}
                {submitSolutionMutation.isPending && (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-gray-400">
                     <Loader2 className="w-6 h-6 animate-spin text-[#01AC9F]" />
                     <p className="text-[10px] font-semibold text-gray-500">Grading final submission against hidden test suite...</p>
                  </div>
                )}

                {/* 2. Idle State */}
                {!runCodeMutation.isPending && !runCodeMutation.data && !submitSolutionMutation.isPending && !submitSolutionMutation.data && (
                  <div className="py-12 text-center text-gray-400 space-y-1.5">
                    <Terminal className="w-8 h-8 mx-auto text-gray-300" />
                    <p className="text-[11px] font-bold text-gray-600">Console Panel is ready</p>
                    <p className="text-[10px] text-gray-400">Click "Run Code" to test example cases or "Submit Code" for final grading.</p>
                  </div>
                )}

                {/* 3. Run Output Results */}
                {!runCodeMutation.isPending && runCodeMutation.data && (
                  <div className="space-y-3">
                    {/* Compilation error checks */}
                    {runCodeMutation.data.status === "COMPILATION_ERROR" ? (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-red-700 text-xs font-bold">
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>Compilation Error</span>
                        </div>
                        <pre className="text-[10px] font-mono text-red-600 bg-red-50/50 p-2.5 rounded-lg overflow-x-auto whitespace-pre-wrap leading-normal">
                          {runCodeMutation.data.compileError}
                        </pre>
                      </div>
                    ) : runCodeMutation.data.status === "SYSTEM_ERROR" ? (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl space-y-1">
                        <p className="text-red-700 text-xs font-bold">System Connection Error</p>
                        <p className="text-[10px] text-red-600">{runCodeMutation.data.compileError || "Failed to reach execution runner."}</p>
                      </div>
                    ) : (
                      // Success run cases
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-gray-400">RUN SUMMARY:</span>
                          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                            COMPLETED
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {runCodeMutation.data.testCaseResults?.map((res, idx) => (
                            <div key={res.testCaseId} className="border border-gray-100 rounded-xl p-3 bg-white space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-500">Test Case #{idx + 1}</span>
                                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                                  res.status === "Accepted"
                                    ? "bg-emerald-500 text-white"
                                    : "bg-rose-500 text-white"
                                }`}>
                                  {res.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-[9px] text-gray-400 font-mono">
                                <span className="flex items-center gap-0.5"><Clock className="w-3 h-3 text-gray-300" /> {res.executionTime} ms</span>
                                <span className="flex items-center gap-0.5"><Cpu className="w-3 h-3 text-gray-300" /> {res.memoryUsed} MB</span>
                              </div>
                              
                              {/* Renders Actual vs Expected comparison panel */}
                              {res.status !== "Accepted" && (
                                <div className="text-[9px] font-mono bg-gray-50 p-2 rounded-lg border border-gray-100 text-gray-600 space-y-1">
                                  <div><span className="text-gray-400">Expected:</span> <span className="text-gray-800 font-bold">{res.expectedOutput}</span></div>
                                  <div><span className="text-gray-400">Actual:</span> <span className="text-rose-600 font-bold">{res.actualOutput}</span></div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Submit Output Results */}
                {!submitSolutionMutation.isPending && submitSolutionMutation.data && (
                  <div className="space-y-3">
                    {submitSolutionMutation.data.status === "Compilation Error" ? (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl space-y-2">
                        <div className="flex items-center gap-1.5 text-red-700 text-xs font-bold">
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>Compilation Error</span>
                        </div>
                        <pre className="text-[10px] font-mono text-red-600 bg-red-50/50 p-2.5 rounded-lg overflow-x-auto whitespace-pre-wrap leading-normal">
                          {submitSolutionMutation.data.errorMessage}
                        </pre>
                      </div>
                    ) : (
                      // Success submission summary
                      <div className="bg-[#ffd7f0]/10 border border-[#ffd7f0]/30 rounded-xl p-4 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ffd7f0]/30 pb-3">
                          <div className="flex items-center gap-2">
                            {submitSolutionMutation.data.status === "Accepted" ? (
                              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                            )}
                            <div>
                              <p className="text-xs font-black text-gray-800">
                                Submission Result: <span className={submitSolutionMutation.data.status === "Accepted" ? "text-emerald-600" : "text-rose-600"}>{submitSolutionMutation.data.status}</span>
                              </p>
                              <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                                Passed: {submitSolutionMutation.data.passedTests} / {submitSolutionMutation.data.totalTests} cases
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Final Score</p>
                            <p className="text-sm font-black text-[#510047]">{submitSolutionMutation.data.score} / 100</p>
                          </div>
                        </div>

                        {/* Performance metrics banner */}
                        <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-gray-500">
                          <div className="bg-white border border-gray-100 p-2.5 rounded-lg flex items-center justify-between">
                            <span>Max Execution Time:</span>
                            <span className="font-bold text-gray-800">{submitSolutionMutation.data.executionTime} ms</span>
                          </div>
                          <div className="bg-white border border-gray-100 p-2.5 rounded-lg flex items-center justify-between">
                            <span>Peak Memory:</span>
                            <span className="font-bold text-gray-800">{submitSolutionMutation.data.memoryUsed} MB</span>
                          </div>
                        </div>

                        {/* Submission cases results detail lists */}
                        <div className="space-y-1.5">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Test Suite Details:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {submitSolutionMutation.data.testCaseResults?.map((res, idx) => (
                              <span
                                key={res.testCaseId}
                                title={`Case ${idx + 1} (${res.isHidden ? 'Hidden' : 'Public'}): ${res.status}`}
                                className={`text-[9px] font-mono font-bold px-2 py-1 rounded-md flex items-center gap-1 select-none ${
                                  res.status === "Accepted"
                                    ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                                    : "bg-rose-500/10 text-rose-700 border border-rose-500/20"
                                }`}
                              >
                                #{idx + 1} {res.isHidden ? "🔒" : "👁️"}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              // SUBMISSION HISTORY LIST
              <div className="space-y-2">
                {submissions.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">
                    <p className="text-xs">No submission records found.</p>
                    <p className="text-[10px] text-gray-400 mt-1">Submit your first solution draft to save history logs here.</p>
                  </div>
                ) : (
                  <div className="border border-gray-100 rounded-xl overflow-hidden text-[10px] font-mono bg-white">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 select-none">
                          <th className="p-2">Submission</th>
                           <th className="p-2">Language</th>
                           <th className="p-2">Status</th>
                           <th className="p-2">Score</th>
                           <th className="p-2">Time</th>
                           <th className="p-2 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-gray-700">
                        {submissions.map((sub, idx) => (
                          <tr key={sub.id} className="hover:bg-gray-50/50">
                            <td className="p-2 font-bold text-gray-500">#{submissions.length - idx}</td>
                            <td className="p-2 uppercase font-bold">{sub.language}</td>
                            <td className="p-2">
                              <span className={`font-extrabold ${
                                sub.status === "Accepted" ? "text-emerald-600" : "text-rose-600"
                              }`}>
                                {sub.status}
                              </span>
                            </td>
                            <td className="p-2 font-bold">{sub.score}/100</td>
                            <td className="p-2">{sub.executionTime}ms</td>
                            <td className="p-2 text-right text-gray-400">
                              {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
