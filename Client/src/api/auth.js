import axios from "axios";

const endpoint = (path) =>
  `${(process.env.REACT_APP_URL || "").replace(/\/+$/, "")}/user/${path}`;
const options = { withCredentials: true, timeout: 15000 };

export const verifyAccountSession = (signal) => axios.get(endpoint("verify"), { ...options, signal });
export const loginAccount = (values) => axios.post(endpoint("login"), values, options);
export const createAccount = (values) => axios.post(endpoint("signup"), values, options);
export const requestPasswordReset = (values) => axios.post(endpoint("forgot_password"), values, options);
export const resetAccountPassword = (token, values) =>
  axios.post(endpoint(`reset_password/${encodeURIComponent(token)}`), values, options);
export const logoutAccount = () => axios.post(endpoint("logout"), {}, options);

export const authErrorMessage = (error, fallback) => {
  const message = error.response?.data?.message;
  if (typeof message === "string" && message.trim()) return message;
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return "The request timed out. Please try again.";
  }
  if (error.response?.status === 429) return "Too many attempts. Please try again later.";
  if (error.response?.status >= 500) return "The server is having trouble. Please try again later.";
  if (error.request && !error.response) {
    return "Could not reach MovieBag. Check your connection and try again.";
  }
  return fallback;
};
