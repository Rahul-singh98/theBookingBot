import axios from "axios";
import { AUTH_API_URL, AuthRoutes } from "./routes";
import { getAuthorizationHeader } from "@/utils/authorization";

export const get_permissions_for_group = async (group_id) => {
  if (!group_id) {
    throw new Error("Invalid permission id provided");
  }
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AUTH_API_URL === undefined ? "" : AUTH_API_URL}${AuthRoutes.GROUP_PERMISSIONS}/${group_id}`;

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

export const add_group_to_permission = async (group_id, permission_id) => {
  if (!group_id || !permission_id) throw new Error("Invalid ids");
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AUTH_API_URL === undefined ? "" : AUTH_API_URL}${AuthRoutes.GROUP_PERMISSIONS}`;
    const response = await axios.post(
      endpoint,
      { group_id, permission_id },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const remove_group_from_permission = async (group_id, permission_id) => {
  if (!group_id || !permission_id) throw new Error("Invalid ids");
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${AUTH_API_URL === undefined ? "" : AUTH_API_URL}${AuthRoutes.GROUP_PERMISSIONS}/${group_id}/${permission_id}`;
    const response = await axios.delete(endpoint, { headers });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
