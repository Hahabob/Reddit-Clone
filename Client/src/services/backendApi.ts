import axios, { type AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-react";

const BACKEND_API_BASE = "http://localhost:3001";

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

const createApiInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: BACKEND_API_BASE,
    timeout: 10000,
  });
};

export const useAuthenticatedApi = () => {
  const { getToken, isSignedIn } = useAuth();

  const getApi = async (): Promise<AxiosInstance> => {
    const api = createApiInstance();

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
