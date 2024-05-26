import axios from "axios";
import { Notify } from "./NotificationService";
import router from "@/router";

// Set base URL for Axios
axios.defaults.baseURL = import.meta.env.VITE_APP_API_BASE_URL;

// Axios response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && router.currentRoute.value.name !== "superAdmin-login") {

      // TODO: Purge Auth

      Notify("Unauthenticated !", "error");

      router.push({ name: "superAdmin-login", query: { redirect_to: router.currentRoute.value as unknown as string } });

    }

    return Promise.reject(error);
  }
);

// Set default headers
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true

const token = JSON.parse(localStorage.getItem("token") as string);

if (token) {
  axios.defaults.headers["Authorization"] = `Bearer ${token}`;
}

// Export axios instance
export default axios;
