import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// This will be set by the AuthProvider component once Clerk is ready
let getTokenFn = null;

export const setClerkGetToken = (fn) => {
  getTokenFn = fn;
};

// Interceptor to attach Clerk auth token to every request
axiosInstance.interceptors.request.use(async (config) => {
  if (getTokenFn) {
    try {
      const token = await getTokenFn();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Token might not be available if user is not signed in
    }
  }
  return config;
});

export default axiosInstance;