import axios from "axios";
import { getAllAPI } from "./shared";
import { ChatRoutes } from "./routes";
import { getAuthorizationHeader } from "@/utils/authorization";

// Function to get all submit_config configurations
export const get_submit_configs = async () => {
  const endpoint = `${ChatRoutes.SUBMIT_CONFIGS}`;
  return getAllAPI(endpoint);
};

export const get_submit_config_by_id = async (submit_config_id) => {
  if (!submit_config_id) {
    throw new Error("Invalid submit_config id provided");
  }
  try {
    headers = getAuthorizationHeader();
    const endpoint = `${ChatRoutes.SUBMIT_CONFIGS}/${submit_config_id}`;

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

export const create_submit_config = async (
  bot_id,
  url,
  auth_type,
  authentication_key
) => {
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${ChatRoutes.SUBMIT_CONFIGS}`;

    const payload = {
      bot_id,
      url,
      auth_type,
      authentication_key,
    };

    console.log("Creating submit_config with", payload);
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

export const update_submit_config = async (
  submit_config_id,
  bot_id,
  url,
  auth_type,
  authentication_key
) => {
  if (!submit_config_id) {
    throw new Error("Invalid submit_config id provided");
  }
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${ChatRoutes.SUBMIT_CONFIGS}/${submit_config_id}`;

    const payload = {
      bot_id,
      url,
      auth_type,
      authentication_key,
    };

    const response = await axios.put(endpoint, payload, { headers });

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

export const delete_submit_config = async (submit_config_id) => {
  if (!submit_config_id) {
    throw new Error("Invalid submit_config id provided");
  }

  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${ChatRoutes.SUBMIT_CONFIGS}/${submit_config_id}`;

    const response = await axios.delete(endpoint, { headers });

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
