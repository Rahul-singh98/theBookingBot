import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { get_org_chatbots } from "@/api/chatbot";
import { useAuth } from "@/hooks/useAuth";
import SimpleModal from "@/components/Modal/SimpleModal";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import PageTitle from "@/components/PageTitle";
import EnhancedTable from "@/components/Tables/EnhancedTables";
import { tableConfigs } from "@/components/Tables/tableConfigs";
import DynamicForm from "@/components/Forms/DynamicForm";
import { formConfigs } from "@/components/Forms/formConfigs";


const ChatbotList = () => {
  const tableName = "chatbots"
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Get the configuration for the current table
  const tableConfig = tableConfigs[tableName];
  const formConfig = formConfigs[tableName];

  const navigate = useNavigate();
  const { user } = useAuth()

  // Fetch chatbots from API
  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const response = await get_org_chatbots(user.user_id);
        setChatbots(response.items);
      } catch (error) {
        console.error("Error fetching chatbots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatbots();
  }, []);

  // Handle "Create" button click
  const handleCreateOrUpdate = (id = null) => {
    if (id) {
      setIsEditModalOpen(true)
    } else {
      setIsCreateModalOpen(true)
    }
  };

  const onCreateSubmit = async (data) => {
    try {
      const response = await formConfig.createData(data)
      navigate(`/admin/chatbot/${response.id}/edit`)
    } catch (err) {
      navigate("/admin/chatbots")
    }
  }


  if (!tableConfig) {
    return (
      <div className="p-4">Table configuration not found for: {tableName}</div>
    );
  }


  if (loading) {
    return <div className="text-center text-lg font-medium">Loading...</div>;
  }

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Chatbots</h1>
          <button
            onClick={() => handleCreateOrUpdate()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Create Chatbot
          </button>
        </div>

        {chatbots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chatbots.map((bot) => (
              <div
                key={bot.id}
                className="border p-4 rounded shadow hover:shadow-md transition cursor-pointer"
                onClick={() => handleCreateOrUpdate(bot.id)}
              >
                <h2 className="text-xl font-semibold">{bot.name}</h2>
                <p className="text-gray-600">{bot.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">No chatbots found.</div>
        )}
      </div>

      {/* Create Modal */}
      <SimpleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Entry"
      >
        <DynamicForm
          fields={formConfig.fields}
          onSubmit={onCreateSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
          matrixLayout={formConfig.formLayout}
        />
      </SimpleModal>

      {/* Edit Modal */}
      {
        <SimpleModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Entry"
        >
          {/* <FormComponent
            fields={formFields}
            initialData={currentItem}
            onSubmit={handleEdit}
            onCancel={() => setIsEditModalOpen(false)}
            matrixLayout={formLayout}
          /> */}
        </SimpleModal>
      }

    </>
  );
};

export default ChatbotList;
