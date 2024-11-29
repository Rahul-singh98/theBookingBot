import axios from "axios";
import { AUTH_API_URL, AuthRoutes } from "./routes";
import { getAllAPI } from "./shared";

// Function to handle user login
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${AUTH_API_URL || ''}${AuthRoutes.LOGIN}`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error(error.response.data.detail)
          case 403:
            throw new Error("Forbidden. You do not have permission to access this resource.");
          case 404:
            throw new Error("Not found. The login endpoint does not exist.");
          case 500:
            throw new Error("Internal server error. Please try again later.");
          default:
            throw new Error(`Unexpected server error: ${error.response.status}`);
        }
      } else if (error.request) {
        throw new Error("Network error. Please check your internet connection and try again.");
      } else {
        throw new Error("An unexpected error occurred. Please try again.");
      }
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};
