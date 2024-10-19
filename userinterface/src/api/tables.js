import { get_groups, get_users, get_permissions } from "./auth";
import { get_chatbots } from "./chatbot";

export const tableApi = {
  users: async () => {
    const response = await get_users();
    return response.items;
  },
  chatbots: async () => {
    const response = await get_chatbots();
    return response.items;
  },
  groups: async () => {
    const response = await get_groups();
    return response.items;
  },
  permissions: async () => {
    const response = await get_permissions();
    return response.items;
  },
};
