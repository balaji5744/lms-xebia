/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { CourseCatalogView } from "./components/CourseCatalogView";
import { CourseDetailView } from "./components/CourseDetailView";
import CategoryManagement from "./pages/CategoryManagement";
import { CourseWizardParent } from "./components/CourseWizard/CourseWizardParent";
import { Toast } from "./components/Toast";

const AppContent: React.FC = () => {
  // Pull toast and hideToast from the AppContext Brain!
  const { currentView, toast, hideToast } = useApp();

  return (
    <div className="min-h-screen bg-gray-50/50 flex font-sans">
      {/* Sidebar - Fixed Left Rail */}
      <Sidebar />

      {/* Main Panel Content Frame */}
      <div className="flex-1 pl-[280px] min-h-screen flex flex-col">
        {/* Header - Sticky Top Bar */}
        <Header />

        {/* Primary Page Layout view with generous responsive spacing */}
        <main className="flex-grow p-8 max-w-7xl w-full mx-auto relative">
          {currentView === "courses" && <CourseCatalogView />}
          {currentView === "categories" && <CategoryManagement />}
          {currentView === "wizard" && <CourseWizardParent />}
          {currentView === "course-detail" && <CourseDetailView />}
        </main>
      </div>

      {/* GLOBAL TOAST RENDERER */}
      {/* If "toast" exists in our AppContext, draw it on the screen! */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
