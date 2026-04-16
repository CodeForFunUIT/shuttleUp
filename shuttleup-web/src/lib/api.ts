import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true, // For sharing cookies if Next/Nest are on same domain, otherwise BetterAuth handles tokens through headers
});

api.interceptors.request.use((config) => {
  // If you use token-based auth, you can inject here. Better Auth mostly handles user sessions nicely.
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle global errors gracefully (toasts, unauthorized redirects)
    return Promise.reject(error);
  }
);
