import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/layout/AdminLayout";
import Loader from "@/common/Loader";
import { useAuth } from "@/hooks/useAuth";
// import SimpleTable from "@/scenes/admin/Tables/SimpleTable";
import Tables from "./Tables";
import PageTitle from "@/common/PageTitle";

const AdminApp = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

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
        <Route
          path="tables/:tableName"
          element={
            <>
              <Tables />
              <PageTitle title="Table | The Booking Bot" />
            </>
          }
        />
      </Routes>
    </AdminLayout>
  ) : (
    <Navigate to="/login?next=/admin" replace />
  );
};

export default AdminApp;
