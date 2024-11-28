import axios from "axios";
import { CHATBOT_API_URL, ChatRoutes } from "./routes";

// Function to handle user login
export const uploadImage = async (formData) => {
  try {
    const response = await axios.post(`${CHATBOT_API_URL === undefined ? '' : CHATBOT_API_URL}${ChatRoutes.UPLOAD_IMAGE}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload file error:", error);
    throw error;
  }
};
