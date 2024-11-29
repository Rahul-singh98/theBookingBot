import axios from "axios";
import { getAllAPI } from "./shared";
import { CHATBOT_API_URL, ChatRoutes } from "./routes";
import { getAuthorizationHeader } from "@/utils/authorization";

// Function to get all chatbot configurations
export const get_chatbots = async () => {
  const endpoint = `${CHATBOT_API_URL === undefined ? '' : CHATBOT_API_URL}${ChatRoutes.CHATBOT_CONFIGS}`;
  return getAllAPI(endpoint);
};

export const get_org_chatbots = async (org_id) => {
  const endpoint = `${CHATBOT_API_URL === undefined ? '' : CHATBOT_API_URL}${ChatRoutes.CHATBOT_CONFIGS}?user_id=${org_id}`;
  return getAllAPI(endpoint);
};

export const get_chatbot_configs = async (chatbot_config_id) => {
  if (!chatbot_config_id) {
    throw new Error("Invalid chatbot id provided");
  }
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${CHATBOT_API_URL === undefined ? '' : CHATBOT_API_URL}${ChatRoutes.CHATBOT_CONFIGS}/${chatbot_config_id}`;

    const response = await axios.get(endpoint, { headers });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized");
    } else {
      throw error;
    }
  }
};

export const create_chatbot_configs = async (
  name,
  hero_img,
  primary_color,
  secondary_color
) => {
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${CHATBOT_API_URL === undefined ? '' : CHATBOT_API_URL}${ChatRoutes.CHATBOT_CONFIGS}`;

    const payload = {
      name,
      hero_img,
      primary_color,
      secondary_color,
    };

    const response = await axios.post(endpoint, payload, { headers });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized");
    } else {
      throw error;
    }
  }
};

export const update_chatbot_configs = async (
  chatbot_config_id,
  name,
  hero_img,
  primary_color,
  secondary_color
) => {
  if (!chatbot_config_id) {
    throw new Error("Invalid chatbot id provided");
  }
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${CHATBOT_API_URL === undefined ? '' : CHATBOT_API_URL}${ChatRoutes.CHATBOT_CONFIGS}/${chatbot_config_id}`;

    const payload = {
      name,
      hero_img,
      primary_color,
      secondary_color,
    };

    const response = await axios.put(endpoint, payload, { headers });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized");
    } else {
      throw error;
    }
  }
};

export const delete_chatbot_configs = async (chatbot_config_id) => {
  if (!chatbot_config_id) {
    throw new Error("Invalid chatbot id provided");
  }

  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${CHATBOT_API_URL === undefined ? '' : CHATBOT_API_URL}${ChatRoutes.CHATBOT_CONFIGS}/${chatbot_config_id}`;

    const response = await axios.delete(endpoint, { headers });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized");
    } else {
      throw error;
    }
  }
};
