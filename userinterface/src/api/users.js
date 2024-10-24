import axios from "axios";
import { getAllAPI } from "./shared";
import { AuthRoutes, AUTH_API_URL } from "./routes";
import { getAuthorizationHeader } from "@/utils/authorization";

// Function to get all user
export const get_users = async () => {
  const endpoint = `${AUTH_API_URL}${AuthRoutes.USERS}`;
  return getAllAPI(endpoint);
};

export const get_user_by_id = async (user_id) => {
  if (!user_id) {
    throw new Error("Invalid user id provided");
  }
  try {
    headers = getAuthorizationHeader();
    const endpoint = `${AUTH_API_URL}${AuthRoutes.USERS}/${user_id}`;

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

export const create_user = async (
  first_name,
  last_name,
  username,
  email,
  password,
  status
) => {
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AUTH_API_URL}${AuthRoutes.USERS}/`;

    const payload = {
      first_name,
      last_name,
      username,
      email,
      password,
      status,
    };

    console.log("Creating user with", payload);
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

export const update_user = async (
  user_id,
  first_name,
  last_name,
  username,
  email,
  password,
  status
) => {
  if (!user_id) {
    throw new Error("Invalid user id provided");
  }
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AUTH_API_URL}${AuthRoutes.USERS}/${user_id}`;

    const payload = {
      first_name,
      last_name,
      username,
      email,
      password,
      status,
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

export const delete_user = async (user_id) => {
  if (!user_id) {
    throw new Error("Invalid user id provided");
  }

  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AUTH_API_URL}${AuthRoutes.USERS}/${user_id}`;

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
