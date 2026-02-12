import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppData } from "../context/AppContext";

const ProtectedRoute = () => {
  const { isAuth, loading } = AppData();

  // Although AppProvider handles initial loading, this covers manual refetches
  if (loading) return null;

  // If authenticated, render child routes (Outlet); otherwise, redirect to login
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
