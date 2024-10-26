import axios from "axios";
import { getAllAPI } from "./shared";
import { AuthRoutes, AUTH_API_URL } from "./routes";
import { getAuthorizationHeader } from "@/utils/authorization";

// Function to get all permission
export const get_permissions = async () => {
  const endpoint = `${AUTH_API_URL}${AuthRoutes.PERMISSIONS}`;
  return getAllAPI(endpoint);
};

export const get_permission_by_id = async (permission_id) => {
  if (!permission_id) {
    throw new Error("Invalid permission id provided");
  }
  try {
    headers = getAuthorizationHeader();
    const endpoint = `${AUTH_API_URL}${AuthRoutes.PERMISSIONS}/${permission_id}`;

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

export const create_permission = async (name, description, scope) => {
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AUTH_API_URL}${AuthRoutes.PERMISSIONS}/`;

    const payload = {
      name,
      description,
      scope,
    };

    console.log("Creating permission with", payload);
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

export const update_permission = async (permission_id, name, description) => {
  if (!permission_id) {
    throw new Error("Invalid permission id provided");
  }
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AUTH_API_URL}${AuthRoutes.PERMISSIONS}/${permission_id}`;

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

export const delete_permission = async (permission_id) => {
  if (!permission_id) {
    throw new Error("Invalid permission id provided");
  }

  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AUTH_API_URL}${AuthRoutes.PERMISSIONS}/${permission_id}`;

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
