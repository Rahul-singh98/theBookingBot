import axios from "axios";
import { AuthRoutes, AUTH_API_URL } from "./routes";
import { getAllAPI } from "./shared";

// Function to handle user login
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}${AuthRoutes.LOGIN}`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Function to get users
export const get_users = async () => {
  const apiRoute = `${AUTH_API_URL}${AuthRoutes.USERS}`;
  return getAllAPI(apiRoute);
};

// Function to get groups
export const get_groups = async () => {
  const endpoint = `${AUTH_API_URL}${AuthRoutes.GROUPS}`;
  return getAllAPI(endpoint);
};

// Function to get permissions
export const get_permissions = async () => {
  const endpoint = `${AUTH_API_URL}${AuthRoutes.PERMISSIONS}`;
  return getAllAPI(endpoint);
};
