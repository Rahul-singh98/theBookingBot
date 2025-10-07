import axios from "axios";
import { AUTH_API_URL, AuthRoutes } from "./routes";
import { getAuthorizationHeader } from "@/utils/authorization";

export const get_groups_for_user = async (user_id) => {
  if (!user_id) {
    throw new Error("Invalid group id provided");
  }
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AUTH_API_URL === undefined ? "" : AUTH_API_URL}${AuthRoutes.USER_GROUPS}/${user_id}`;

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

export const add_user_to_group = async (user_id, group_id) => {
  if (!user_id || !group_id) throw new Error("Invalid ids");
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AUTH_API_URL === undefined ? "" : AUTH_API_URL}${AuthRoutes.USER_GROUPS}`;
    const response = await axios.post(
      endpoint,
      { user_id, group_id },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const remove_user_from_group = async (user_id, group_id) => {
  if (!user_id || !group_id) throw new Error("Invalid ids");
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AUTH_API_URL === undefined ? "" : AUTH_API_URL}${AuthRoutes.USER_GROUPS}/${user_id}/${group_id}`;
    const response = await axios.delete(endpoint, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
