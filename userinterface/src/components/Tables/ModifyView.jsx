import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PageTitle from "@/components/PageTitle";
import DynamicTable from "./DynamicTable";
import EnhancedTable from "./EnhancedTables";
import { tableConfigs } from "./tableConfigs";
import DynamicForm from "@/components/Forms/DynamicForm";
import { formConfigs } from "@/components/Forms/formConfigs";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Editor from "../Editor";

const AdminModifyView = () => {
  const { tableName, chatbotId } = useParams();
  const [currentItem, setCurrentItem] = useState(null);
  const { user, afterLogout } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("table");

  // Get the configuration for the current table
  const tableConfig = tableConfigs[tableName];
  const formConfig = formConfigs[tableName];

  if (!tableConfig) {
    return (
      <div className="p-4">Table configuration not found for: {tableName}</div>
    );
  }

  // Fetch data with automatic refresh
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await formConfigs[tableName].getData(chatbotId);
        console.log("Result", result);
        setCurrentItem(result);
      } catch (err) {
        if (err.message === "Unauthorized") {
          afterLogout();
          navigate(`/login?next=${location.pathname}`);
        } else {
          // setError(err.message);
        }
      }
    };

    loadData();
  }, []);

  const handleEdit = async (formData) => {
    try {
      await formConfig.updateData(currentItem.id, formData);
      await formConfig.fetchData();
    } catch (err) {
      if (err.message === "Unauthorized") {
        afterLogout();
        navigate(`/login?next=${location.pathname}`);
      }
    }
  };

  // Modify formFields to set bot_id to hidden and assign value as chatbotId
  const modifiedFormFields = formConfigs["questions"].fields.reduce(
    (acc, field) => {
      // If field is bot_id, modify its properties
      if (field.id === "bot_id" || field.name === "bot_id") {
        acc.push({
          ...field,
          type: "hidden", // Set type to hidden
          value: chatbotId, // Set value to chatbotId
        });
      } else if (field.id === "next_ques" || field.name === "next_ques") {
        acc.push({
          ...field,
          options: async () => {
            // Fetch chatbot configs
            const response = await formConfigs["questions"].fetchData(chatbotId);

            console.log("Response", response);

            return response.map((ques) => ({
              value: ques.id,
              label: ques.question,
            }));
          },
        });
      } else {
        acc.push(field); // Add other fields as-is
      }
      return acc;
    },
    []
  );

  // Modify formLayout to set bot_id colSpan to 0
  const modifiedFormLayout = {
    ...formConfigs["questions"].formLayout,
    rows: formConfigs["questions"].formLayout.rows.map((row) =>
      row.map((cell) => {
        if (cell.name === "bot_id") {
          return { ...cell, colSpan: 0 };
        } else if (cell.name === "question_type") {
          return { ...cell, colSpan: 4 };
        }
        return cell;
      })
    ),
  };

  const chatbotFields = formConfig.fields.reduce((acc, field) => {
    if (field.name !== "email" && field.name !== "temp_password") {
      acc.push(field);
    }
    return acc;
  }, []);

  const chatbotFormLayout = {
    ...formConfig.formLayout,
    rows: formConfig.formLayout.rows.slice(0, -1), // Corrected slicing
  };

  return (
    <div className="pt-3">
      <Breadcrumb
        pageName={`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} Edit`}
      />
      <PageTitle>{`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} Management`}</PageTitle>

      <DynamicForm
        fields={chatbotFields}
        initialData={currentItem}
        onSubmit={handleEdit}
        onCancel={() => {}}
        matrixLayout={chatbotFormLayout}
      />

      {tableName === "chatbots" && (
        <>
          <button
            onClick={() =>
              setViewMode(viewMode === "table" ? "graph" : "table")
            }
            className="mb-3 text-white bg-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-primary dark:hover:bg-primary dark:focus:ring-blue-800"
          >
            {viewMode === "table" ? "Switch to Graph" : "Switch to Table"}
          </button>

          {viewMode === "table" ? (
            <EnhancedTable
              tableName={"questions"}
              fetchData={async () => {
                try {
                  const result =
                    await formConfigs["questions"].fetchData(chatbotId);
                  return result || [];
                } catch (err) {
                  console.log("Error fetching api", err);
                  return [];
                }
              }}
              columns={tableConfigs["questions"].columns}
              searchFields={tableConfigs["questions"].searchFields}
              defaultSort={tableConfigs["questions"].defaultSort}
              onRowClick={(row) => {
                console.log("Row clicked:", row);
              }}
              FormComponent={DynamicForm}
              formFields={modifiedFormFields}
              initialData={{ bot_id: chatbotId }}
              createData={formConfigs["questions"].createData}
              updateData={formConfigs["questions"].updateData}
              deleteData={formConfigs["questions"].deleteData}
              formLayout={modifiedFormLayout}
            />
          ) : (
            <Editor />
          )}
        </>
      )}
    </div>
  );
};

export default AdminModifyView;
