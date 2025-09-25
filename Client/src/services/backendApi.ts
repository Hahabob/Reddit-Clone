import axios, { type AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-react";

const BACKEND_API_BASE = "http://localhost:3001";

// User interface for type safety
export interface BackendUser {
  _id: string;
  clerkId: string;
  username: string;
  displayName?: string;
  about?: string;
  socialLinks?: string[];
  isMature: boolean;
  isModerator: boolean;
  avatarUrl?: string;
  bannerUrl?: string;
  karma: {
    post: number;
    comment: number;
  };
  gender: string;
  createdAt: string;
  updatedAt?: string;
}

// Create base API instance
const createApiInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: BACKEND_API_BASE,
    timeout: 10000, // 10 second timeout
  });
};

// Hook to get authenticated API instance
export const useAuthenticatedApi = () => {
  const { getToken, isSignedIn } = useAuth();

  const getApi = async (): Promise<AxiosInstance> => {
    const api = createApiInstance();

    // Add authentication interceptor
    api.interceptors.request.use(async (config) => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Failed to get auth token:", error);
        }
      }
      return config;
    });

    // Add error response interceptor
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error(
            "Authentication failed - user may need to sign in again"
          );
        }
        return Promise.reject(error);
      }
    );

    return api;
  };

  return getApi;
};
