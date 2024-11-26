import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/layout/AdminLayout";
import Loader from "@/components/Loader";
import { useAuth } from "@/hooks/useAuth";
import AdminTables from "@/components/Tables/AdminTables";
import { useLocation } from "react-router-dom";
import DynamicForm from "@/components/Forms/DynamicForm";
import AdminCreateView from "@/components/Tables/CreateView";
import AdminModifyView from "@/components/Tables/ModifyView";
import OrgBot from "./OrgBot";
import ChatbotList from "./ChatbotList";
import Editor from "@/components/Editor";

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
        <Route path="org-bot" element={<OrgBot />} />
        <Route path="/chatbots" element={<ChatbotList />} />
        <Route path="/chatbot/:chatbotId/edit" element={<Editor />} />
        <Route path="tables/:tableName" element={<AdminTables />} />
        <Route path="tables/:tableName/create" element={<AdminCreateView />} />
        <Route path="tables/:tableName/:itemId/edit" element={<AdminModifyView />} />
      </Routes>
    </AdminLayout>
  ) : (
    <Navigate to={`/login?next=${location.pathname}`} replace />
  );
};

export default AdminApp;
