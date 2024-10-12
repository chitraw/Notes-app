import axios from "axios";
import { BASEURL } from "./constant";

// Create an axios instance
const axiosinstance = axios.create({
  baseURL: BASEURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json", // Corrected typo
  },
});

// Interceptor to add the token to the Authorization header
axiosinstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosinstance;
