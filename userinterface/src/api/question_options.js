import axios from "axios";
import { getAllAPI } from "./shared";
import { ChatRoutes, CHATBOT_API_URL } from "./routes";
import { getAuthorizationHeader } from "@/utils/authorization";

// Function to get all question_option configurations
export const get_question_options = async () => {
  const endpoint = `${CHATBOT_API_URL}${ChatRoutes.QUESTIONS}/`;
  return getAllAPI(endpoint);
};

export const get_question_option_by_id = async (question_option_id) => {
  if (!question_option_id) {
    throw new Error("Invalid question_option id provided");
  }
  try {
    headers = getAuthorizationHeader();
    const endpoint = `${CHATBOT_API_URL}${ChatRoutes.QUESTIONS}/${question_option_id}`;

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
  bot_id,
  question_option,
  question_option_order,
  response_type,
  variable
) => {
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${CHATBOT_API_URL}${ChatRoutes.QUESTIONS}/`;

    question_option_order = Number(question_option_order);

    const payload = {
      bot_id,
      question_option,
      question_option_order,
      response_type,
      variable,
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
  question_option_id,
  bot_id,
  question_option,
  question_option_order,
  response_type,
  variable
) => {
  if (!question_option_id) {
    throw new Error("Invalid question_option id provided");
  }
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${CHATBOT_API_URL}${ChatRoutes.QUESTIONS}/${question_option_id}`;

    const payload = {
      bot_id,
      question_option,
      question_option_order,
      response_type,
      variable,
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

export const delete_question_options = async (question_option_id) => {
  if (!question_option_id) {
    throw new Error("Invalid question_option id provided");
  }

  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${CHATBOT_API_URL}${ChatRoutes.QUESTIONS}/${question_option_id}`;

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
