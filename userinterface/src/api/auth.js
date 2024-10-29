import axios from "axios";
import { AuthRoutes } from "./routes";
import { getAllAPI } from "./shared";

// Function to handle user login
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${AuthRoutes.LOGIN}`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
