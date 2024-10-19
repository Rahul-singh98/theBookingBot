import axios from "axios";
import { getAuthorizationHeader } from "@/utils/authorization";

// Function to get permissions
export const getAllAPI = async (endpoint, isAuthNeeded = true) => {
  //   console.log(endpoint, isAuthNeeded);
  try {
    let headers = {};
    if (isAuthNeeded) {
      headers = getAuthorizationHeader();
    }

    // console.log(headers);

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
