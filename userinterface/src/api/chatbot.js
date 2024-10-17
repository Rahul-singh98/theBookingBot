import axios from "axios";
import { ChatRoutes, CHATBOT_API_URL } from "./routes";

// Function to get all chatbot configurations
export const chatbots = async () => {
  try {
    const response = await axios.get(
      `${CHATBOT_API_URL}${ChatRoutes.CHATBOT_CONFIGS}`
    );
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};
