import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Course, Module, SeoSettings } from "../../types";
import { WizardStep1 } from "./WizardStep1";
import { WizardStep2 } from "./WizardStep2";
import { WizardStep3 } from "./WizardStep3";
import { WizardStep4 } from "./WizardStep4";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Save,
  Send,
  Sparkles,
  FileText,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export const CourseWizardParent: React.FC = () => {
  const {
    wizardCourseId,
    wizardStep,
    setWizardStep,
    courses,
    addCourse,
    updateCourse,
    setCurrentView,
    setWizardCourseId,
  } = useApp();

  // Create a localized temporary course draft state inside the wizard
  const [courseDraft, setCourseDraft] = useState<any>(() => {
    return {
      title: "",
      slug: "",
      category: "",
      description: "",
      status: "Draft",
      duration: "4.5 Hours",
      difficulty: "Beginner",
      language: "English",
      thumbnailUrl: "",
      modules: [],
      seo: {
        indexInSearch: true,
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        keywords: "",
        ogImage: "",
        ogTitle: "",
        ogDescription: "",
        xCardType: "Large Summary Card",
      },
    };
  });

  const [activeSubmoduleId, setActiveSubmoduleId] = useState<number | null>(
    null,
  );
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Load existing course if editing
  useEffect(() => {
    if (wizardCourseId) {
      const existing = courses.find((c) => c.id === wizardCourseId);
      if (existing) {
        // Deep copy
        setCourseDraft(JSON.parse(JSON.stringify(existing)));
      }
    }
  }, [wizardCourseId, courses]);

  const steps = [
    { number: 1, label: "Basic Details" },
    { number: 2, label: "Curriculum" },
    { number: 3, label: "Media & Content" },
    { number: 4, label: "Settings & SEO" },
  ];

  // Quick navigation triggers
  const handleNextStep = () => {
    if (wizardStep === 1) {
      if (!courseDraft.title) {
        alert("Please fill in the Course Title to proceed.");
        return;
      }
      if (!courseDraft.category) {
        alert("Please select a Category to proceed.");
        return;
      }
    }

    // Save temporary state changes back to context
    handleSaveDraftSilent();

    if (wizardStep < 4) {
      setWizardStep(wizardStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  // Shortcut from step 2 inline compose button to step 3 block editor
  const handleEditSubmoduleContentShortcut = (submoduleId: number) => {
    setActiveSubmoduleId(submoduleId);
    handleSaveDraftSilent();
    setWizardStep(3);
  };

  const handleSaveDraftSilent = () => {
    if (!courseDraft.title) return; // Need a title to save

    if (wizardCourseId) {
      // Update existing
      updateCourse({
        ...courseDraft,
        id: wizardCourseId,
      });
    } else {
      // Create new draft
      const newId = addCourse(courseDraft);
      setWizardCourseId(newId);
    }
  };

  const handleSaveDraftManual = () => {
    if (!courseDraft.title) {
      alert("Course Title is required to save a draft.");
      return;
    }

    handleSaveDraftSilent();
    triggerToast(
      "Draft auto-saved successfully. All structural, content block, and meta tags are persisted.",
    );
  };

  const handlePublishCourse = () => {
    if (!courseDraft.title) {
      alert("Course Title is required to publish.");
      return;
    }

    if (wizardCourseId !== null) {
      const finalCourse: Course = {
        ...courseDraft,
        status: "Active", // Set status to active upon publishing!
        id: wizardCourseId,
      };
      updateCourse(finalCourse);
    } else {
      const finalCourse: Omit<Course, "id" | "learnersCount" | "modules"> = {
        ...courseDraft,
        status: "Active", // Set status to active upon publishing!
      };
      addCourse(finalCourse);
    }

    // Return to main list
    setWizardCourseId(null);
    setWizardStep(1);
    setCurrentView("courses");

    // Alert user
    alert(
      `Congratulations! "${courseDraft.title}" is now published and indexed on the corporate curriculum board!`,
    );
  };

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => {
      setSaveToast(null);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Wizard Header Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gray-400 mb-2">
            <span
              className="cursor-pointer hover:text-gray-600"
              onClick={() => setCurrentView("courses")}
            >
              Courses
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-[#510047]">Course Authoring Suite</span>
          </nav>
          <h2 className="text-3xl font-bold font-headline text-[#510047]">
            {wizardCourseId ? "Edit Learning Program" : "Create New Course"}
          </h2>
          <p className="text-gray-500 text-sm">
            Design, structure, and configure SEO assets for your corporate
            program.
          </p>
        </div>

        <button
          onClick={() => {
            if (
              confirm("Discard unstaged wizard changes and return to catalog?")
            )
              setCurrentView("courses");
          }}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-xs transition-all"
        >
          Cancel Wizard
        </button>
      </div>

      {/* SEGMENTED STEP PROGRESS TIMELINE */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between relative max-w-3xl mx-auto">
          {steps.map((step, idx) => {
            const isCompleted = wizardStep > step.number;
            const isActive = wizardStep === step.number;

            return (
              <React.Fragment key={step.number}>
                {/* Connecting Horizontal Line */}
                {idx > 0 && (
                  <div className="flex-grow h-1.5 mx-4 rounded bg-gray-100 overflow-hidden relative">
                    <div
                      className="h-full bg-[#510047] transition-all duration-300"
                      style={{
                        width: wizardStep >= step.number ? "100%" : "0%",
                      }}
                    />
                  </div>
                )}

                {/* Circular indicator node */}
                <div
                  onClick={() => {
                    // Let users jump back to completed steps for fast editing!
                    if (
                      step.number < wizardStep ||
                      (step.number > wizardStep &&
                        courseDraft.title &&
                        courseDraft.category)
                    ) {
                      setWizardStep(step.number);
                    }
                  }}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 shadow-sm ${
                      isCompleted
                        ? "bg-[#510047] border-[#510047] text-white"
                        : isActive
                          ? "bg-white border-[#510047] text-[#510047] ring-4 ring-[#ffd7f0]"
                          : "bg-white border-gray-200 text-gray-400 hover:border-gray-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider mt-2.5 transition-colors ${
                      isActive
                        ? "text-[#510047]"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP CONTAINER OUTLET */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        {wizardStep === 1 && (
          <WizardStep1
            courseData={courseDraft}
            setCourseData={setCourseDraft}
            onNext={(courseId) => {
              setWizardCourseId(courseId);
              setWizardStep(2);
            }}
          />
        )}
        {wizardStep === 2 && (
          <WizardStep2
            courseData={courseDraft}
            setCourseData={setCourseDraft}
            onEditSubmoduleContent={handleEditSubmoduleContentShortcut}
          />
        )}
        {wizardStep === 3 && (
          <WizardStep3
            courseData={courseDraft}
            setCourseData={setCourseDraft}
            activeSubmoduleId={activeSubmoduleId}
            setActiveSubmoduleId={setActiveSubmoduleId}
          />
        )}
        {wizardStep === 4 && (
          <WizardStep4
            courseData={courseDraft}
            setCourseData={setCourseDraft}
          />
        )}
      </div>

      {/* STICKY ACTION FOOTER BAR */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-lg flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentView("courses")}
          className="px-5 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl text-xs font-bold transition-all"
        >
          Back to Catalog
        </button>

        <div className="flex gap-3">
          {/* Back button */}
          {wizardStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          )}

          {/* Save Draft button */}
          <button
            type="button"
            onClick={handleSaveDraftManual}
            className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-[#510047] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>

          {/* Continue / Publish */}
          {wizardStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-[#510047] hover:bg-[#3c0034] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-md"
            >
              Save & Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublishCourse}
              className="px-6 py-2.5 bg-[#01AC9F] hover:bg-[#008f84] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-[0.98]"
            >
              <Send className="w-4 h-4" /> Publish Program
            </button>
          )}
        </div>
      </div>

      {/* Manual save status notification toast */}
      {saveToast && (
        <div className="fixed bottom-6 left-6 max-w-sm bg-gray-900 text-white p-4 rounded-xl shadow-2xl border border-white/10 z-50 flex gap-2.5 animate-slide-up">
          <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-white/90 leading-relaxed font-medium">
            {saveToast}
          </p>
        </div>
      )}
    </div>
  );
};
