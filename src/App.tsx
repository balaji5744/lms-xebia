/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CourseCatalogView } from './components/CourseCatalogView';
import { CourseDetailView } from './components/CourseDetailView';
import CategoryManagement from './pages/CategoryManagement';
import { CourseWizardParent } from './components/CourseWizard/CourseWizardParent';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-gray-50/50 flex font-sans">
      {/* Sidebar - Fixed Left Rail */}
      <Sidebar />

      {/* Main Panel Content Frame */}
      <div className="flex-1 pl-[280px] min-h-screen flex flex-col">
        {/* Header - Sticky Top Bar */}
        <Header />

        {/* Primary Page Layout view with generous responsive spacing */}
        <main className="flex-grow p-8 max-w-7xl w-full mx-auto">
          {currentView === 'courses' && <CourseCatalogView />}
          {currentView === 'categories' && <CategoryManagement />}
          {currentView === 'wizard' && <CourseWizardParent />}
          {currentView === 'course-detail' && <CourseDetailView />}
        </main>
      </div>
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
