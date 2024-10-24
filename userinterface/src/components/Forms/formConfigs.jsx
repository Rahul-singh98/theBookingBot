import {
  get_chatbots,
  get_chatbot_configs,
  create_chatbot_configs,
  update_chatbot_configs,
  delete_chatbot_configs,
} from "@/api/chatbot";

import {
  get_groups,
  get_group_by_id,
  create_group,
  update_group,
  delete_group,
} from "@/api/groups";

import {
  get_permissions,
  get_permission_by_id,
  create_permission,
  update_permission,
  delete_permission,
} from "@/api/permissions";

import {
  get_users,
  get_user_by_id,
  create_user,
  update_user,
  delete_user,
} from "@/api/users";

import {
  get_questions,
  get_question_by_id,
  create_questions,
  update_questions,
  delete_questions,
} from "@/api/questions";

export const formConfigs = {
  chatbots: {
    fields: [
      {
        name: "name",
        label: "Chatbot Name",
        type: "text",
        required: true,
        placeholder: "Enter the chatbot name",
      },
      {
        name: "hero_img",
        label: "Image URL",
        type: "text",
        required: true,
        placeholder: "Enter the image url",
      },
      {
        name: "welcome_message",
        label: "Welcome Message",
        type: "text",
        required: true,
        placeholder: "Enter the first message",
      },
      {
        name: "primary_color",
        label: "Primary Color",
        type: "text",
        placeholder: "Enter your primary color",
      },
      {
        name: "secondary_color",
        label: "Secondary Color",
        type: "text",
        placeholder: "Enter your secondary color",
      },
    ],
    createData: async (formData) => {
      const {
        name,
        hero_img,
        welcome_message,
        primary_color,
        secondary_color,
      } = formData;
      return create_chatbot_configs(
        name,
        hero_img,
        welcome_message,
        primary_color,
        secondary_color
      );
    },
    updateData: async (chatbot_config_id, formData) => {
      const {
        name,
        hero_img,
        welcome_message,
        primary_color,
        secondary_color,
      } = formData;
      return update_chatbot_configs(
        chatbot_config_id,
        name,
        hero_img,
        welcome_message,
        primary_color,
        secondary_color
      );
    },
    deleteData: async (chatbot_config_id) => {
      return delete_chatbot_configs(chatbot_config_id);
    },
    getData: async (chatbot_config_id) => {
      return get_chatbot_configs(chatbot_config_id);
    },
    fetchData: async () => {
      const response = await get_chatbots();
      return response.items;
    },
  },
  users: {
    fields: [
      {
        name: "username",
        label: "UserName",
        type: "text",
        required: true,
        placeholder: "Enter your username",
      },
      {
        name: "first_name",
        label: "First Name",
        type: "text",
        required: true,
        placeholder: "Enter the first name",
      },
      {
        name: "last_name",
        label: "Last Name",
        type: "text",
        required: true,
        placeholder: "Enter the last name",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "Enter the email",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        required: true,
        placeholder: "password",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "InActive" },
          { value: "suspended", label: "Suspended" },
        ],
      },
    ],
    createData: async (formData) => {
      const { first_name, last_name, username, email, password, status } =
        formData;
      return create_user(
        first_name,
        last_name,
        username,
        email,
        password,
        status
      );
    },
    updateData: async (user_id, formData) => {
      const { first_name, last_name, username, email, password, status } =
        formData;
      return update_user(
        user_id,
        first_name,
        last_name,
        username,
        email,
        password,
        status
      );
    },
    deleteData: async (user_id) => {
      return delete_user(user_id);
    },
    getData: async (user_id) => {
      return get_user_by_id(user_id);
    },
    fetchData: async () => {
      const response = await get_users();
      return response.items;
    },
  },
  groups: {
    fields: [
      {
        name: "name",
        label: "Group Name",
        type: "text",
        required: true,
        placeholder: "Enter the group name",
      },
      {
        name: "description",
        label: "Description",
        type: "text",
        required: false,
        placeholder: "Enter the group description",
      },
    ],
    createData: async (formData) => {
      const { name, description } = formData;
      return create_group(name, description);
    },
    updateData: async (group_id, formData) => {
      const { name, description } = formData;
      return update_group(group_id, name, description);
    },
    deleteData: async (group_id) => {
      return delete_group(group_id);
    },
    getData: async (group_id) => {
      return get_group_by_id(group_id);
    },
    fetchData: async () => {
      const response = await get_groups();
      return response.items;
    },
  },
  permissions: {
    fields: [
      {
        name: "name",
        label: "Permission Name",
        type: "text",
        required: true,
        placeholder: "Enter the permission name",
        validationRules: {
          pattern:
            "^[a-zA-Z0-9-_]+:(\\*|[a-zA-Z0-9-_]+)(:\\*|:[a-zA-Z0-9-_]+)?$",
          message:
            "Permission name must follow the format: group:access:user_id",
          required: true,
        },
      },
      {
        name: "description",
        label: "Description",
        type: "text",
        required: false,
        placeholder: "Enter the permission description",
      },
      {
        name: "scope",
        label: "Scope",
        type: "text",
        required: true,
        placeholder: "Enter the permission scope",
      },
    ],
    createData: async (formData) => {
      const { name, description, scope } = formData;
      return create_permission(name, description, scope);
    },
    updateData: async (permission_id, formData) => {
      const { name, description, scope } = formData;
      return update_permission(permission_id, name, description, scope);
    },
    deleteData: async (permission_id) => {
      return delete_permission(permission_id);
    },
    getData: async (permission_id) => {
      return get_permission_by_id(permission_id);
    },
    fetchData: async () => {
      const response = await get_permissions();
      return response.items;
    },
  },
  questions: {
    fields: [
      {
        name: "bot_id",
        label: "Chatbot ID",
        type: "select",
        required: true,
        options: async () => {
          // Fetch chatbot configs
          const response = await get_chatbots();

          return response.items.map((bot) => ({
            value: bot.id,
            label: bot.name,
          }));
        },
      },
      {
        name: "question",
        label: "Question",
        type: "text",
        required: true,
        placeholder: "Write your question to ask",
      },
      {
        name: "question_order",
        label: "Question Order",
        type: "number",
        required: true,
        placeholder: "Set priority of question",
        validationRules: {
          min: 0,
          max: 100,
          required: true,
        },
      },
      {
        name: "response_type",
        label: "Response Type",
        type: "select",
        required: true,
        options: [
          { value: "dropdown", label: "DROPDOWN" },
          { value: "datetime", label: "DATETIME" },
          { value: "address", label: "ADDRESS" },
          { value: "number", label: "NUMBER" },
          { value: "clicklist", label: "CLICKLIST" },
          { value: "input", label: "INPUT" },
          { value: "phone", label: "PHONE" },
          { value: "email", label: "EMAIL" },
        ],
      },
      {
        name: "variable",
        label: "Variable Name",
        type: "text",
        placeholder: "Please provide variable name",
      },
    ],
    createData: async (formData) => {
      const { bot_id, question, question_order, response_type, variable } =
        formData;
      return create_questions(
        bot_id,
        question,
        question_order,
        response_type,
        variable
      );
    },
    updateData: async (question_id, formData) => {
      const { bot_id, question, question_order, response_type, variable } =
        formData;
      return update_questions(
        question_id,
        bot_id,
        question,
        question_order,
        response_type,
        variable
      );
    },
    deleteData: async (question_id) => {
      return delete_questions(question_id);
    },
    getData: async (question_id) => {
      return get_questions(question_id);
    },
    fetchData: async () => {
      const response = await get_questions();
      return response.items;
    },
  },
};
