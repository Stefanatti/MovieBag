import axios from "axios";
import { logout } from "../Features/user";

const api = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

export const syncExpiredSession = (store) => {
  api.interceptors.request.use((config) => {
    config.accountAtRequest = store.getState().user;
    return config;
  });
  api.interceptors.response.use(undefined, (error) => {
    const currentUser = store.getState().user;
    if (error.response?.status === 401 && currentUser.isAuthenticated &&
        error.config?.accountAtRequest === currentUser) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  });
};

export default api;
