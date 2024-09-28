import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/layout/AdminLayout";
import Loader from "@/common/Loader";
// import SimpleTable from "@/scenes/admin/Tables/SimpleTable";
import Tables from "./Tables";
import PageTitle from "@/common/PageTitle";

const AdminApp = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
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
  );
};

export default AdminApp;
