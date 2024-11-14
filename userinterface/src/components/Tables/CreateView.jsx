import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PageTitle from "@/components/PageTitle";
import DynamicTable from "./DynamicTable";
import EnhancedTable from "./EnhancedTables";
import { tableConfigs } from "./tableConfigs";
import DynamicForm from "@/components/Forms/DynamicForm";
import { formConfigs } from "@/components/Forms/formConfigs";

const AdminCreateView = () => {
  const { tableName } = useParams();

  // Get the configuration for the current table
  const tableConfig = tableConfigs[tableName];
  const formConfig = formConfigs[tableName];

  if (!tableConfig) {
    return (
      <div className="p-4">Table configuration not found for: {tableName}</div>
    );
  }

  return (
    <>
      <Breadcrumb
        pageName={`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} Table Create`}
      />
      <PageTitle>{`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} Management`}</PageTitle>

      
    </>
  );
};

export default AdminCreateView;
