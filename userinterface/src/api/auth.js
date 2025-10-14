import axios from "axios";
import { AUTH_API_URL, AuthRoutes } from "./routes";
import { getAllAPI } from "./shared";
import { getVisitorId } from "@/utils/cookieUtils";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = import.meta.env.VITE_CHATBOT_CRYPTO_KEY;

function encryptValue(plaintext) {
  // Decode base64 key
  const key = CryptoJS.enc.Base64.parse(ENCRYPTION_KEY);
  // Generate a random 16-byte IV (like nonce)
  const iv = CryptoJS.lib.WordArray.random(16);

  // Encrypt using AES-CBC
  const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Combine IV + ciphertext
  const combined = iv.concat(encrypted.ciphertext);

  // Convert to base64
  return CryptoJS.enc.Base64.stringify(combined);
}

// Function to handle user login
export const login = async (username, password) => {
  const visitorId = getVisitorId();
  try {
    const encryptedPassword = encryptValue(password);
    const response = await axios.post(
      `${AUTH_API_URL || ""}${AuthRoutes.LOGIN}`,
      {
        username,
        password: encryptedPassword,
      },
      {
        headers: {
          Visitor: visitorId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Login error:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error(error.response.data.detail);
          case 403:
            throw new Error(
              "Forbidden. You do not have permission to access this resource."
            );
          case 404:
            throw new Error("Not found. The login endpoint does not exist.");
          case 500:
            throw new Error("Internal server error. Please try again later.");
          default:
            throw new Error(
              `Unexpected server error: ${error.response.status}`
            );
        }
      } else if (error.request) {
        throw new Error(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        throw new Error("An unexpected error occurred. Please try again.");
      }
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};

export const confirm_reset_password = async (token, new_password) => {
  const response = await axios.post(
    `${AUTH_API_URL || ""}${AuthRoutes.CONFIRM_RESET_PASSWORD}`,
    {
      token,
      new_password,
    }
  );
  return response.data;
};
