import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_URL,
});

// Attach token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("id");
      // Optionally redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
