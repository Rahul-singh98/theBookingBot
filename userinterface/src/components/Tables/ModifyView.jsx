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


const AdminModifyView = () => {
  const { tableName, itemId } = useParams();
  const [currentItem, setCurrentItem] = useState(null);
  const { user, afterLogout } = useAuth();
  const navigate = useNavigate();

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
        const result = await formConfigs[tableName].getData(itemId);
        console.log("Result", result)
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

  // Modify formFields to set bot_id to hidden and assign value as itemId
  const modifiedFormFields = formConfigs['questions'].fields.reduce((acc, field) => {
    // If field is bot_id, modify its properties
    if (field.id === 'bot_id' || field.name === 'bot_id') {
      acc.push({
        ...field,
        type: 'hidden',  // Set type to hidden
        value: itemId,   // Set value to itemId
      });
    } else {
      acc.push(field);  // Add other fields as-is
    }
    return acc;
  }, []);

  // Modify formLayout to set bot_id colSpan to 0
  const modifiedFormLayout = {
    ...formConfigs['questions'].formLayout,
    rows: formConfigs['questions'].formLayout.rows.map(row =>
      row.map(cell => {
        if (cell.name === 'bot_id') {
          return { ...cell, colSpan: 0 };
        } else if (cell.name === "question_type") {
          return { ...cell, colSpan: 4}
        }
        return cell;
      })
    )
  };


  return (
    <>
      <Breadcrumb
        pageName={`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} Table Edit`}
      />
      <PageTitle>{`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} Management`}</PageTitle>

      <DynamicForm
        fields={formConfig.fields}
        initialData={currentItem}
        onSubmit={handleEdit}
        onCancel={() => { }}
        matrixLayout={formConfig.formLayout} />

      {
        tableName === "chatbots" ? <>
          <p className="mt-3" />
          <EnhancedTable
            tableName={'questions'}
            fetchData={async () => {
              try {
                const result = await formConfigs['questions'].fetchData(itemId)
                return result || []
              } catch (err) {
                console.log("Error fetching api", err);
                return [];
              }
            }}
            columns={tableConfigs['questions'].columns}
            searchFields={tableConfigs['questions'].searchFields}
            defaultSort={tableConfigs['questions'].defaultSort}
            onRowClick={(row) => {
              console.log("Row clicked:", row);
            }}
            FormComponent={DynamicForm}
            formFields={modifiedFormFields}
            createData={formConfigs['questions'].createData}
            updateData={formConfigs['questions'].updateData}
            deleteData={formConfigs['questions'].deleteData}
            formLayout={modifiedFormLayout} />
        </> : <></>
      }
    </>


  );
};

export default AdminModifyView;
