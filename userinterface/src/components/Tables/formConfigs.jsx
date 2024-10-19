import { create_chatbot_configs } from "@/api/chatbot";

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
    updateData: async () => {},
    deleteData: async () => {},
    fetchData: async () => {},
  },
  users: {
    fields: [],
    createData: async () => {},
    updateData: async () => {},
    deleteData: async () => {},
    fetchData: async () => {},
  },
  groups: {
    fields: [],
    createData: async () => {},
    updateData: async () => {},
    deleteData: async () => {},
    fetchData: async () => {},
  },
  permissions: {
    fields: [],
    createData: async () => {},
    updateData: async () => {},
    deleteData: async () => {},
    fetchData: async () => {},
  },
};
