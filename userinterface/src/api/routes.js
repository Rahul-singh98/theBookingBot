export const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
export const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL;
export const ANALYTICS_API_URL = import.meta.env.VITE_PROMETHEUS_BASE_URL;
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthRoutes = {
  LOGIN: "/api/auth/login",
  CONFIRM_RESET_PASSWORD: "/api/auth/password-reset-confirm",
  USERS: "/api/users",
  GROUPS: "/api/groups",
  PERMISSIONS: "/api/permissions",
};

export const ChatRoutes = {
  GET_MESSAGES: "/messages",
  SEND_MESSAGE: "/messages/send",
  CHATBOT_CONFIGS: "/api/chatbots",
  QUESTIONS: "/api/questions",
  QUESTION_OPTIONS: "/api/options",
  SUBMIT_CONFIGS: "/api/submit-configs",
  UPLOAD_IMAGE: "/api/questions/upload",
  CHATBOT_STATIC_JS_PATH: "/static/js/embed.min.js",
  CHATBOT_STATIC_CSS_PATH: "/static/css/embed.css",
};

export const AnalyticsRoutes = {
  BASE: "/api/v1",
  QUERY: "/query"
}
