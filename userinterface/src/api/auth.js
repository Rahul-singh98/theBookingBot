import axios from "axios";
import { AuthRoutes, AUTH_API_URL } from "./routes";
import { getAccessToken } from "@/utils/authorization";

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
  try {
    const token = getAccessToken();
    const response = await axios.get(`${AUTH_API_URL}${AuthRoutes.USERS}`, {
      headers: {
        Authorization: `${token.token_type} ${token.access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
