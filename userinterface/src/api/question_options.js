import axios from "axios";
import { getAllAPI } from "./shared";
import { ChatRoutes } from "./routes";
import { getAuthorizationHeader } from "@/utils/authorization";

// Function to get all question_option configurations
export const get_question_options = async () => {
  const endpoint = `${ChatRoutes.QUESTION_OPTIONS}`;
  return getAllAPI(endpoint);
};

export const get_questions_options = async (question_id) => {
  if (!question_id) {
    throw new Error("Invalid option id provided");
  }
  try {
    headers = getAuthorizationHeader();
    const endpoint = `${ChatRoutes.QUESTIONS}/options`;

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

export const get_question_option_by_id = async (option_id) => {
  if (!option_id) {
    throw new Error("Invalid question_option id provided");
  }
  try {
    headers = getAuthorizationHeader();
    const endpoint = `${ChatRoutes.QUESTION_OPTIONS}/${option_id}`;

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

export const create_question_options = async (
  question_id,
  option_text,
  option_order
) => {
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${ChatRoutes.QUESTION_OPTIONS}`;

    option_order = Number(option_order);

    const payload = {
      question_id,
      option_text,
      option_order,
    };

    console.log("Creating question_option with", payload);
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

export const update_question_options = async (
  option_id,
  question_id,
  option_text,
  option_order
) => {
  if (!option_id) {
    throw new Error("Invalid question_option id provided");
  }
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${ChatRoutes.QUESTION_OPTIONS}/${option_id}`;

    const payload = {
      question_id,
      option_text,
      option_order,
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

export const delete_question_options = async (option_id) => {
  if (!option_id) {
    throw new Error("Invalid question_option id provided");
  }

  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${ChatRoutes.QUESTION_OPTIONS}/${option_id}`;

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
