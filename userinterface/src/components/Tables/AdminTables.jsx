import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PageTitle from "@/components/PageTitle";
import DynamicTable from "./DynamicTable";
import EnhancedTable from "./EnhancedTables";
import { tableConfigs } from "./tableConfigs";
import DynamicForm from "@/components/Forms/DynamicForm";
import { formConfigs } from "@/components/Forms/formConfigs";

const AdminTables = () => {
  const { tableName } = useParams();
  console.log("TableName", tableName);

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
        pageName={`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} Table`}
      />
      <PageTitle>{`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} Management`}</PageTitle>

      <EnhancedTable
        fetchData={formConfig.fetchData}
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
