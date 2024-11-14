import axios from "axios";
import { AUTH_API_URL, AuthRoutes } from "./routes";
import { getAllAPI } from "./shared";

// Function to handle user login
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${AUTH_API_URL === undefined ? '' : AUTH_API_URL}${AuthRoutes.LOGIN}`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
