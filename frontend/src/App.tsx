import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { CourseCatalogView } from "./components/CourseCatalogView";
import { CourseDetailView } from "./components/CourseDetailView";
import CategoryManagement from "./pages/CategoryManagement";
import { CourseWizardParent } from "./components/CourseWizard/CourseWizardParent";
import { Toast } from "./components/Toast";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Authenticated Layout wrapper with the Sidebar and Header
const MainLayout: React.FC = () => {
  const { sidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } =
    useApp();

  // Prevent background scrolling while the mobile sidebar is open
  React.useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50/50 flex font-sans relative overflow-x-hidden">
      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar - Fixed Left Rail */}
      <Sidebar />

      {/* Main Panel Content Frame */}
      <div
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "md:pl-[80px]" : "md:pl-[280px]"
        } pl-0`}
      >
        {/* Header - Sticky Top Bar */}
        <Header />

        {/* Primary Page Layout view with generous responsive spacing */}
        <main className="flex-grow p-4 sm:p-8 max-w-7xl w-full mx-auto relative transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  // Pull toast and hideToast from the AppContext Brain!
  const { toast, hideToast } = useApp();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Routes>
        {/* Anonymous Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Base Redirection */}
          <Route path="/" element={<Navigate to="/courses" replace />} />

          {/* Catalog: Shared access for Admin & Student */}
          <Route path="/courses" element={<CourseCatalogView />} />

          {/* Detail: Shared access, contents are filtered by enrollment status inside the view */}
          <Route path="/course-detail/:id" element={<CourseDetailView />} />

          {/* Categories: Admin Only */}
          <Route
            path="/categories"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CategoryManagement />
              </ProtectedRoute>
            }
          />

          {/* Wizard Creation: Admin Only */}
          <Route
            path="/wizard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CourseWizardParent />
              </ProtectedRoute>
            }
          />

          {/* Wizard Edition: Admin Only */}
          <Route
            path="/wizard/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CourseWizardParent />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/courses" replace />} />
      </Routes>

      {/* GLOBAL TOAST RENDERER */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
