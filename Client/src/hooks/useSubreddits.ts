import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApi } from "../services/backendApi";
import { queryKeys } from "../services/queryKeys";

// Types
export interface CreateSubredditData {
  name: string;
  displayName: string;
  description?: string;
  rules?: string[];
  isPrivate?: boolean;
  allowImages?: boolean;
  allowPolls?: boolean;
}

export interface UpdateSubredditData {
  displayName?: string;
  description?: string;
  rules?: string[];
  isPrivate?: boolean;
  allowImages?: boolean;
  allowPolls?: boolean;
}

// QUERY HOOKS
export const useSubreddits = () => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.subreddits.all,
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get("/subreddits");
      return response.data;
    },
  });
};

export const useSubreddit = (subredditId: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.subreddits.detail(subredditId),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/subreddits/${subredditId}`);
      return response.data;
    },
    enabled: !!subredditId,
  });
};

export const usePopularSubreddits = () => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.subreddits.popular,
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get("/subreddits/popular");
      return response.data;
    },
  });
};

export const useJoinedSubreddits = (userId: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.subreddits.joined(userId),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/users/${userId}/subreddits`);
      return response.data;
    },
    enabled: !!userId,
  });
};

// MUTATION HOOKS
export const useCreateSubreddit = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async (subredditData: CreateSubredditData) => {
      const api = await getApi();
      const response = await api.post("/subreddits", subredditData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate subreddits list
      queryClient.invalidateQueries({ queryKey: queryKeys.subreddits.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.subreddits.popular });
    },
  });
};

export const useUpdateSubreddit = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async ({
      subredditId,
      data,
    }: {
      subredditId: string;
      data: UpdateSubredditData;
    }) => {
      const api = await getApi();
      const response = await api.patch(`/subreddits/${subredditId}`, data);
      return response.data;
    },
    onSuccess: (updatedSubreddit, variables) => {
      // Update the specific subreddit in cache
      queryClient.setQueryData(
        queryKeys.subreddits.detail(variables.subredditId),
        updatedSubreddit
      );

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.subreddits.all });
    },
  });
};

export const useJoinSubreddit = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async (subredditId: string) => {
      const api = await getApi();
      const response = await api.post(`/subreddits/${subredditId}/join`);
      return response.data;
    },
    onSuccess: (_, subredditId) => {
      // Invalidate subreddit data to refresh membership status
      queryClient.invalidateQueries({ queryKey: ["subreddits"] });

      // Invalidate joined subreddits for current user
      queryClient.invalidateQueries({ queryKey: ["subreddits", "joined"] });
    },
    // Optimistic update
    onMutate: async (subredditId) => {
      // Find subreddit in cache and optimistically update join status
      const subredditQueries = queryClient.getQueriesData({
        queryKey: ["subreddits"],
      });

      subredditQueries.forEach(([queryKey, data]) => {
        if (Array.isArray(data)) {
          const updatedData = data.map((subreddit: any) =>
            subreddit.id === subredditId
              ? {
                  ...subreddit,
                  isJoined: true,
                  memberCount: subreddit.memberCount + 1,
                }
              : subreddit
          );
          queryClient.setQueryData(queryKey, updatedData);
        }
      });
    },
  });
};

export const useLeaveSubreddit = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async (subredditId: string) => {
      const api = await getApi();
      const response = await api.delete(`/subreddits/${subredditId}/join`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all subreddit-related queries
      queryClient.invalidateQueries({ queryKey: ["subreddits"] });
    },
    // Optimistic update
    onMutate: async (subredditId) => {
      const subredditQueries = queryClient.getQueriesData({
        queryKey: ["subreddits"],
      });

      subredditQueries.forEach(([queryKey, data]) => {
        if (Array.isArray(data)) {
          const updatedData = data.map((subreddit: any) =>
            subreddit.id === subredditId
              ? {
                  ...subreddit,
                  isJoined: false,
                  memberCount: Math.max(0, subreddit.memberCount - 1),
                }
              : subreddit
          );
          queryClient.setQueryData(queryKey, updatedData);
        }
      });
    },
  });
};

// Get posts for a specific subreddit
export const useSubredditPosts = (subredditId: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: ["subreddits", subredditId, "posts"],
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/subreddits/${subredditId}/posts`);
      return response.data;
    },
    enabled: !!subredditId,
  });
};
