import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "student")[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { userRole, showToast } = useApp();

  if (!userRole) {
    // If not authenticated, send to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If authenticated but role is not allowed
    // Show a warning toast first
    setTimeout(() => {
      showToast("Access Denied: You do not have permission to view that page.", "error");
    }, 100);
    return <Navigate to="/courses" replace />;
  }

  return <>{children}</>;
};
