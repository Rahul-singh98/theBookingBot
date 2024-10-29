import axios from "axios";
import { getAllAPI } from "./shared";
import { AuthRoutes } from "./routes";
import { getAuthorizationHeader } from "@/utils/authorization";

// Function to get all group
export const get_groups = async () => {
  const endpoint = `${AuthRoutes.GROUPS}`;
  return getAllAPI(endpoint);
};

export const get_group_by_id = async (group_id) => {
  if (!group_id) {
    throw new Error("Invalid group id provided");
  }
  try {
    headers = getAuthorizationHeader();
    const endpoint = `${AuthRoutes.GROUPS}/${group_id}`;

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

export const create_group = async (name, description) => {
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AuthRoutes.GROUPS}/`;

    const payload = {
      name,
      description,
    };

    console.log("Creating group with", payload);
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

export const update_group = async (group_id, name, description) => {
  if (!group_id) {
    throw new Error("Invalid group id provided");
  }
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AuthRoutes.GROUPS}/${group_id}`;

    const payload = {
      name,
      description,
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

export const delete_group = async (group_id) => {
  if (!group_id) {
    throw new Error("Invalid group id provided");
  }

  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AuthRoutes.GROUPS}/${group_id}`;

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
