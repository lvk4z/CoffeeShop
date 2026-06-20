import axios from "axios";
import { store } from "../redux/app/store";

const instance = axios.create({
  baseURL: "/api",
});

// Attach JWT access token to every request
instance.interceptors.request.use((config) => {
  const token = store.getState().auth.access;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 → try to refresh token, then retry original request
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        try {
          const res = await axios.post("/api/token/refresh/", { refresh });
          const newAccess = res.data.access;
          localStorage.setItem("access", newAccess);
          store.dispatch({ type: "auth/tokenRefreshed", payload: { access: newAccess } });
          original.headers.Authorization = `Bearer ${newAccess}`;
          return instance(original);
        } catch {
          store.dispatch({ type: "auth/logout" });
        }
      } else {
        store.dispatch({ type: "auth/logout" });
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
