import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApi, type BackendUser } from "../services/backendApi";
import { queryKeys } from "../services/queryKeys";

export interface UpdateUserData {
  displayName?: string;
  about?: string;
  socialLinks?: string[];
  avatarUrl?: string;
  bannerUrl?: string;
  gender?: string;
}

export const useUser = (userId: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/users/${userId}`);
      return response.data.data as BackendUser; // Backend returns { data: user, success: true }
    },
    enabled: !!userId,
  });
};

export const useUserProfile = (userId: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.users.profile(userId),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/users/${userId}/profile`);
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useCurrentUser = () => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: ["users", "current"],
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get("/users/me");
      return response.data;
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateUserData;
    }) => {
      const api = await getApi();
      const response = await api.patch(`/users/${userId}`, data);
      return response.data as BackendUser;
    },
    onSuccess: (updatedUser, variables) => {
      // Update the specific user in cache
      queryClient.setQueryData(
        queryKeys.users.detail(variables.userId),
        updatedUser
      );

      // Update profile cache if it exists
      queryClient.setQueryData(
        queryKeys.users.profile(variables.userId),
        updatedUser
      );

      // If updating current user, update that cache too
      queryClient.invalidateQueries({ queryKey: ["users", "current"] });
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async (userId: string) => {
      const api = await getApi();
      const response = await api.post(`/users/${userId}/follow`);
      return response.data;
    },
    onSuccess: (_, userId) => {
      // Invalidate user data to refresh follow status
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.profile(userId),
      });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async (userId: string) => {
      const api = await getApi();
      const response = await api.delete(`/users/${userId}/follow`);
      return response.data;
    },
    onSuccess: (_, userId) => {
      // Invalidate user data to refresh follow status
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.profile(userId),
      });
    },
  });
};

export const useUsers = () => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get("/users");
      return response.data;
    },
  });
};

export const useUserPosts = (userId: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.posts.byUser(userId),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/users/${userId}/posts`);
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useUserComments = (userId: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: ["users", userId, "comments"],
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/users/${userId}/comments`);
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useUserOverview = (userId: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: ["users", userId, "overview"],
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/users/${userId}/overview`);
      return response.data;
    },
    enabled: !!userId,
  });
};
