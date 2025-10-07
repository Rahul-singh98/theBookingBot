import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PageTitle from "@/components/PageTitle";
import DynamicTable from "./DynamicTable";
import EnhancedTable from "./EnhancedTables";
import { tableConfigs } from "./tableConfigs";
import DynamicForm from "@/components/Forms/DynamicForm";
import { formConfigs } from "@/components/Forms/formConfigs";
import LinkModal from "@/components/Modal/LinkModal";

const AdminTables = () => {
  const { tableName } = useParams();

  // Get the configuration for the current table
  const tableConfig = tableConfigs[tableName];
  const formConfig = formConfigs[tableName];

  var linkConfigName = null;

  if (tableName === "users") {
    linkConfigName = "user-groups";
  } else if (tableName === "groups") {
    linkConfigName = "group-permissions";
  }

  if (!tableConfig) {
    return (
      <div className="p-4">Table configuration not found for: {tableName}</div>
    );
  }

  return (
    <>
      <Breadcrumb
        pageName={`${tableName.charAt(0).toUpperCase() + tableName.slice(1)}`}
      />
      <PageTitle>{`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} Management`}</PageTitle>

      <EnhancedTable
        tableName={tableName}
        fetchData={formConfig.fetchData}
        columns={tableConfig.columns}
        searchFields={tableConfig.searchFields}
        defaultSort={tableConfig.defaultSort}
        onRowClick={(row) => {
          console.log("Row clicked:", row);
        }}
        // FormComponent={tableName !== "chatbots" ? DynamicForm : OrgBotChatForm}
        FormComponent={DynamicForm}
        formFields={formConfig.fields}
        createData={formConfig.createData}
        updateData={formConfig.updateData}
        deleteData={formConfig.deleteData}
        formLayout={formConfig.formLayout}
        LinkComponent={linkConfigName ? LinkModal : null}
        LinkComponentAttributes={linkConfigName ? formConfigs[linkConfigName] : {}}
      />
    </>
  );
};

export default AdminTables;
