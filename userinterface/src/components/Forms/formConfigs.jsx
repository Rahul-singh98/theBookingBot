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

import {
  get_question_options,
  get_questions_options,
  get_question_option_by_id,
  create_question_options,
  update_question_options,
  delete_question_options,
} from "@/api/question_options";

import {
  get_submit_configs,
  get_submit_config_by_id,
  create_submit_config,
  update_submit_config,
  delete_submit_config,
} from "@/api/submit_configs";

import {
  get_groups_for_user,
  add_user_to_group,
  remove_user_from_group,
} from "@/api/user_groups";

import {
  get_permissions_for_group,
  add_group_to_permission,
  remove_group_from_permission,
} from "@/api/group_permissions";

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
        type: "image",
        required: true,
        placeholder: "Enter the image url",
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
      {
        name: "created_by",
        label: "Assign To",
        type: "select",
        required: true,
        options: async () => {
          const response = await get_users();
          return (response.items || []).map((u) => ({
            value: u.id,
            label: u.email || u.first_name || u.username,
          }));
        },
      },
    ],
    formLayout: {
      columns: 4,
      rows: [
        [{ name: "hero_img", colSpan: 4 }],
        [{ name: "name", colSpan: 4 }],
        [
          { name: "primary_color", colSpan: 2 },
          { name: "secondary_color", colSpan: 2 },
        ],
        [{ name: "created_by", colSpan: 4 }],
      ],
    },
    createData: async (formData) => {
      const { name, hero_img, primary_color, secondary_color, created_by } =
        formData;
      return create_chatbot_configs(
        name,
        hero_img,
        primary_color,
        secondary_color,
        created_by
      );
    },
    updateData: async (chatbot_config_id, formData) => {
      const { name, hero_img, primary_color, secondary_color } = formData;
      return update_chatbot_configs(
        chatbot_config_id,
        name,
        hero_img,
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
    additionalTable: "questions",
  },
  users: {
    fields: [
      {
        name: "username",
        label: "User Name",
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
          { value: "inactive", label: "In Active" },
          { value: "suspended", label: "Suspended" },
          { value: "password_reset_required", label: "Not Logged In" },
        ],
      },
    ],
    formLayout: {
      columns: 4,
      rows: [
        [
          { name: "first_name", colSpan: 2 },
          { name: "last_name", colSpan: 2 },
        ],
        [
          { name: "username", colSpan: 2 },
          { name: "email", colSpan: 2 },
        ],
        [
          { name: "password", colSpan: 2 },
          { name: "status", colSpan: 2 },
        ],
      ],
    },
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
    formLayout: {
      columns: 4,
      rows: [
        [
          { name: "name", colSpan: 2 },
          { name: "description", colSpan: 2 },
        ],
      ],
    },
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
    additionalTable: "permissions",
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
            "^(?:\\*|[a-zA-Z0-9_-]+):(?:\\*|[a-zA-Z0-9_-]+):(?:\\*|[a-fA-F0-9-]{36}|[a-zA-Z0-9_-]+)$",
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
    formLayout: {
      columns: 4,
      rows: [
        [{ name: "name", colSpan: 4 }],
        [{ name: "description", colSpan: 4 }],
        [{ name: "scope", colSpan: 4 }],
      ],
    },
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
        label: "Question to ask",
        type: "text",
        placeholder: "Please enter your question",
      },
      {
        name: "question_type",
        label: "Question Type",
        type: "select",
        required: true,
        options: [
          { value: "Start", label: "START" },
          { value: "Dropdown", label: "DROPDOWN" },
          { value: "Date", label: "DATE" },
          { value: "Time", label: "TIME" },
          { value: "DateTime", label: "DATETIME" },
          { value: "Number", label: "NUMBER" },
          { value: "Input", label: "INPUT" },
          { value: "Conditional", label: "CONDITIONAL" },
          { value: "Email", label: "EMAIL" },
          { value: "Phone", label: "PHONE" },
          { value: "ClickList", label: "CLICKLIST" },
          { value: "Address", label: "ADDRESS" },
          { value: "Payment", label: "PAYMENT" },
          { value: "End", label: "END" },
        ],
      },
      {
        name: "data",
        label: "Data",
        type: "json",
        dependency: "question_type",
        required: true,
        placeholder: "Plese provide json data to process",
        validationRules: {
          required: true,
          custom: (value) => {
            try {
              console.log("json value", value);
              const parsed = JSON.parse(value);
            } catch {
              return "Invalid JSON format";
            }
            return "";
          },
        },
      },
      {
        name: "variable",
        label: "Variable Name",
        type: "text",
        placeholder: "Please provide variable name",
      },
      {
        name: "next_ques",
        label: "Next Question",
        type: "select",
        options: async () => {
          // Fetch chatbot configs
          const response = await get_questions();

          return response.items.map((ques) => ({
            value: ques.id,
            label: ques.question,
          }));
        },
      },
    ],
    formLayout: {
      columns: 4,
      rows: [
        [
          { name: "bot_id", colSpan: 2 },
          { name: "question_type", colSpan: 2 },
        ],
        [{ name: "question", colSpan: 4 }],
        [{ name: "data", colSpan: 4 }],
        [
          { name: "variable", colSpan: 2 },
          { name: "next_ques", colSpan: 2 },
        ],
      ],
    },
    createData: async (formData) => {
      const { bot_id, question, question_type, data, variable, next_ques } =
        formData;
      return create_questions(
        bot_id,
        question,
        question_type,
        data,
        variable,
        next_ques
      );
    },
    updateData: async (question_id, formData) => {
      const { bot_id, question, question_type, data, variable, next_ques } =
        formData;
      return update_questions(
        question_id,
        bot_id,
        question,
        question_type,
        data,
        variable,
        next_ques
      );
    },
    deleteData: async (question_id) => {
      return delete_questions(question_id);
    },
    getData: async (question_id) => {
      return get_questions(question_id);
    },
    fetchData: async (bot_id = null) => {
      const response = await get_questions(bot_id);
      return response.items;
    },
  },

  "question-options": {
    fields: [
      {
        name: "question_id",
        label: "Question ID",
        type: "select",
        required: true,
        options: async () => {
          // Fetch chatbot configs
          const response = await get_questions();

          return response.items.map((ques) => ({
            value: ques.id,
            label: ques.question,
          }));
        },
      },
      {
        name: "option_text",
        label: "Details",
        type: "text",
        required: true,
        placeholder: "Option Value",
      },
      {
        name: "option_order",
        label: "Option Order",
        type: "number",
        required: true,
        placeholder: "Set priority of question",
        validationRules: {
          min: 0,
          max: 100,
          required: true,
        },
      },
    ],
    formLayout: {
      columns: 4,
      rows: [
        [
          { name: "first_name", colSpan: 2 },
          { name: "last_name", colSpan: 2 },
        ],
        [
          { name: "username", colSpan: 2 },
          { name: "email", colSpan: 2 },
        ],
        [
          { name: "password", colSpan: 2 },
          { name: "status", colSpan: 2 },
        ],
      ],
    },
    createData: async (formData) => {
      const { question_id, option_text, option_order } = formData;
      return create_question_options(question_id, option_text, option_order);
    },
    updateData: async (option_id, formData) => {
      const { question_id, option_text, option_order } = formData;
      return update_question_options(
        option_id,
        question_id,
        option_text,
        option_order
      );
    },
    deleteData: async (option_id) => {
      return delete_question_options(option_id);
    },
    getData: async (option_id) => {
      return get_question_option_by_id(option_id);
    },
    fetchData: async () => {
      const response = await get_question_options();
      return response.items;
    },
  },

  "submit-configs": {
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
        name: "url",
        label: "Submit URL",
        type: "text",
        required: true,
        placeholder: "Enter the URL",
      },
      {
        name: "auth_type",
        label: "URL Method",
        type: "select",
        required: true,
        options: [
          { value: "none", label: "NONE" },
          { value: "basic", label: "BASIC" },
          { value: "bearer", label: "BEARER" },
        ],
      },
      {
        name: "authentication_key",
        label: "Authentication Key",
        type: "text",
        required: false,
        placeholder: "Enter the API Key",
      },
    ],
    formLayout: {
      columns: 4,
      rows: [
        [
          { name: "first_name", colSpan: 2 },
          { name: "last_name", colSpan: 2 },
        ],
        [
          { name: "username", colSpan: 2 },
          { name: "email", colSpan: 2 },
        ],
        [
          { name: "password", colSpan: 2 },
          { name: "status", colSpan: 2 },
        ],
      ],
    },
    createData: async (formData) => {
      const { bot_id, url, auth_type, authentication_key } = formData;
      return create_submit_config(bot_id, url, auth_type, authentication_key);
    },
    updateData: async (submit_config_id, formData) => {
      const { bot_id, url, auth_type, authentication_key } = formData;
      return update_submit_config(
        submit_config_id,
        bot_id,
        url,
        auth_type,
        authentication_key
      );
    },
    deleteData: async (submit_config_id) => {
      return delete_submit_config(submit_config_id);
    },
    getData: async (submit_config_id) => {
      return get_submit_config_by_id(submit_config_id);
    },
    fetchData: async () => {
      const response = await get_submit_configs();
      return response.items;
    },
  },
  "user-groups": {
    searchAssets: async (query) => {
      return [];
    },
    listAllAssets: get_groups,
    listByIdAssets: get_groups_for_user,
    addAsset: add_user_to_group,
    removeAsset: remove_user_from_group,
    match_id_name: "group_id",
  },
  "group-permissions": {
    searchAssets: async (query) => {
      return [];
    },
    listAllAssets: get_permissions,
    listByIdAssets: get_permissions_for_group,
    addAsset: add_group_to_permission,
    removeAsset: remove_group_from_permission,
    match_id_name: "permission_id",
  },
};
