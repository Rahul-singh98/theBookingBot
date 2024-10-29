import axios from "axios";
import { getAllAPI } from "./shared";
import { ChatRoutes } from "./routes";
import { getAuthorizationHeader } from "@/utils/authorization";

// Function to get all question configurations
export const get_questions = async () => {
  const endpoint = `${ChatRoutes.QUESTIONS}`;
  return getAllAPI(endpoint);
};

export const get_question_by_id = async (question_id) => {
  if (!question_id) {
    throw new Error("Invalid question id provided");
  }
  try {
    headers = getAuthorizationHeader();
    const endpoint = `${ChatRoutes.QUESTIONS}/${question_id}`;

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

export const create_questions = async (
  bot_id,
  question,
  question_order,
  response_type,
  variable
) => {
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${ChatRoutes.QUESTIONS}`;

    question_order = Number(question_order);

    const payload = {
      bot_id,
      question,
      question_order,
      response_type,
      variable,
    };

    console.log("Creating question with", payload);
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

export const update_questions = async (
  question_id,
  bot_id,
  question,
  question_order,
  response_type,
  variable
) => {
  if (!question_id) {
    throw new Error("Invalid question id provided");
  }
  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${ChatRoutes.QUESTIONS}/${question_id}`;

    const payload = {
      bot_id,
      question,
      question_order,
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

export const delete_questions = async (question_id) => {
  if (!question_id) {
    throw new Error("Invalid question id provided");
  }

  try {
    const headers = getAuthorizationHeader();
    const endpoint = `${ChatRoutes.QUESTIONS}/${question_id}`;

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
