export const tableConfigs = {
  users: {
    columns: [
      { key: "id", header: "ID" },
      { key: "email", header: "Email" },
      { key: "username", header: "Username" },
      { key: "first_name", header: "First Name" },
      { key: "last_name", header: "Last Name" },
      {
        key: "status",
        header: "Status",
        render: (value) => (
          <span
            className={`px-2 py-1 rounded ${
              value === "active"
                ? "bg-green-100 text-green-800"
                : value === "inactive"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {value}
          </span>
        ),
      },
    ],
    searchFields: ["email", "username", "first_name", "last_name"],
    defaultSort: { field: "id", direction: "asc" },
  },
  chatbots: {
    columns: [
      { key: "id", header: "ID" },
      { key: "name", header: "Chatbot Name" },
      { key: "hero_img", header: "Image URL" },
      { key: "welcome_message", header: "Welcome Message" },
      { key: "primary_color", header: "Primary Color" },
      { key: "secondary_color", header: "Secondary Color" },
      { key: "created_by", header: "Author" },
      { key: "created_at", header: "Created On" },
      { key: "updated_at", header: "Last Update On" },
    ],
    searchFields: ["name", "welcome_message"],
    defaultSort: { field: "created_at", direction: "desc" },
  },
  groups: {
    columns: [
      { key: "id", header: "ID" },
      { key: "name", header: "Group Name" },
      { key: "description", header: "Description" },
      { key: "created_at", header: "Create Time" },
      { key: "updated_at", header: "Update Time" },
    ],
    searchFields: ["id", "name", "description"],
    defaultSort: { field: "created_at", direction: "desc" },
  },
  permissions: {
    columns: [
      { key: "id", header: "ID" },
      { key: "name", header: "Permission Name" },
      { key: "scope", header: "Permission" },
      { key: "description", header: "Description" },
      { key: "created_at", header: "Create Time" },
    ],
    searchFields: ["id", "name", "scope", "description"],
    defaultSort: { field: "created_at", direction: "desc" },
  },
  questions: {
    columns: [
      { key: "id", header: "ID" },
      { key: "bot_id", header: "Chatbot ID" },
      { key: "question", header: "Question" },
      { key: "question_order", header: "Question Order" },
      { key: "response_type", header: "Response Type" },
      { key: "variable", header: "Variable Name" },
      { key: "created_by", header: "Author" },
      { key: "created_at", header: "Created On" },
      { key: "updated_at", header: "Last Update On" },
    ],
    searchFields: ["question"],
    defaultSort: { field: "created_at", direction: "desc" },
  },
  "question-options": {
    columns: [
      { key: "id", header: "ID" },
      { key: "question_id", header: "Question ID" },
      { key: "option_text", header: "Option" },
      { key: "option_order", header: "Option Order" },
    ],
    searchFields: ["option_text"],
  },
};
