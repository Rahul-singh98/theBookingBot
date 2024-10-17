export const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
export const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL;

export const AuthRoutes = {
  LOGIN: "/api/auth/login",
  USERS: "/api/users",
};

export const ChatRoutes = {
  GET_MESSAGES: "/messages",
  SEND_MESSAGE: "/messages/send",
  CHATBOT_CONFIGS: "/api/chatbots",
  CHATBOT_STATIC_JS_PATH: "/static/js/embed.min.js",
  CHATBOT_STATIC_CSS_PATH: "/static/css/embed.css",
};
