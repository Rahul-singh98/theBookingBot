import axios from "axios";
import { getAllAPI } from "./shared";
import { ChatRoutes, CHATBOT_API_URL } from "./routes";
import { getAuthorizationHeader } from "@/utils/authorization";

// Function to get all chatbot configurations
export const get_chatbots = async () => {
  const endpoint = `${CHATBOT_API_URL}${ChatRoutes.CHATBOT_CONFIGS}/`;
  return getAllAPI(endpoint);
};

export const get_chatbot_configs = async (chatbot_config_id) => {
  try {
    headers = getAuthorizationHeader();
    const endpoint = `${CHATBOT_API_URL}${ChatRoutes.CHATBOT_CONFIGS}/${chatbot_config_id}`;

    const response = await axios.get(endpoint, { headers });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Please check your credentials or token.");
      throw new Error("Unauthorized");
    } else {
      console.error("Error in API request:", error);
      throw error;
    }
  }
};

export const create_chatbot_configs = async (
  name,
  hero_img,
  welcome_message,
  primary_color,
  secondary_color
) => {
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${CHATBOT_API_URL}${ChatRoutes.CHATBOT_CONFIGS}/`;

    const payload = {
      name,
      hero_img,
      welcome_message,
      primary_color,
      secondary_color,
    };

    console.log("Creating chatbot with", payload);
    const response = await axios.post(endpoint, payload, { headers });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Please check your credentials or token.");
      throw new Error("Unauthorized");
    } else {
      console.error("Error in API request:", error);
      throw error;
    }
  }
};
