import axios, { type AxiosResponse } from "axios";

const BACKEND_API_BASE = "http://localhost:3001";

interface BackendUser {
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
  createdAt: string; // Date becomes string in JSON
  updatedAt?: string; // Added by timestamps: true
}

const backendApi = axios.create({
  baseURL: BACKEND_API_BASE,
});

export const userApi = {
  getUser: async (userId: string) => {
    const response: AxiosResponse = await backendApi.get(`/users/${userId}`);
    return response.data;
  },
  getAllUsers: async () => {
    const response: AxiosResponse = await backendApi.get(`/users`);
    return response.data;
  },
};

export default backendApi;
