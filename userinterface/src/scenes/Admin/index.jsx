import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/layout/AdminLayout";
import Loader from "@/components/Loader";
import { useAuth } from "@/hooks/useAuth";
import AdminTables from "@/components/Tables/AdminTables";
import { useLocation } from "react-router-dom";

const AdminApp = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // If loading, you can return a Loader component
  if (loading) {
    return <Loader />;
  }

  return user ? (
    <AdminLayout>
      <Routes>
        <Route path="tables/:tableName" element={<AdminTables />} />
      </Routes>
    </AdminLayout>
  ) : (
    <Navigate to={`/login?next=${location.pathname}`} replace />
  );
};

export default AdminApp;
