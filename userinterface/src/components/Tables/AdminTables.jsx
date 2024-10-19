import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PageTitle from "@/components/PageTitle";
import DynamicTable from "./DynamicTable";
import EnhancedTable from "./EnhancedTables";
import { get_users } from "@/api/auth";
import { tableApi } from "@/api/tables";
import { tableConfigs } from "./tableConfigs";
import DynamicForm from "@/components/Forms/DynamicForm";
import { formConfigs } from "./formConfigs";

const AdminTables = () => {
  const { tableName } = useParams();
  console.log("TableName", tableName);

  // Get the configuration for the current table
  const tableConfig = tableConfigs[tableName];
  const fetchData = tableApi[tableName];
  const formConfig = formConfigs[tableName];

  if (!tableConfig) {
    return (
      <div className="p-4">Table configuration not found for: {tableName}</div>
    );
  }

  if (!fetchData) {
    return (
      <div className="p-4">Table fetch API not found for: {tableName}</div>
    );
  }

  return (
    <>
      <Breadcrumb
        pageName={`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} Table`}
      />
      <PageTitle>{`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} Management`}</PageTitle>

      <EnhancedTable
        fetchData={fetchData}
        columns={tableConfig.columns}
        searchFields={tableConfig.searchFields}
        defaultSort={tableConfig.defaultSort}
        onRowClick={(row) => {
          console.log("Row clicked:", row);
        }}
        FormComponent={DynamicForm}
        formFields={formConfig.fields}
        createData={formConfig.createData}
        updateData={formConfig.updateData}
        deleteData={formConfig.deleteData}
      />
    </>
  );
};

export default AdminTables;
