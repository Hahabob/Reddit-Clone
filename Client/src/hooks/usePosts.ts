import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApi } from "../services/backendApi";
import { queryKeys } from "../services/queryKeys";

// Types
export interface CreatePostData {
  title: string;
  content?: string;
  subredditId: string;
  type: "text" | "image" | "link";
  imageUrl?: string;
  linkUrl?: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
}

// QUERY HOOKS
export const usePosts = () => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.posts.all,
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get("/posts");
      return response.data;
    },
  });
};

export const usePost = (postId: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.posts.detail(postId),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    },
    enabled: !!postId,
  });
};

export const usePostsBySubreddit = (subredditId: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.posts.bySubreddit(subredditId),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/posts?subredditId=${subredditId}`);
      return response.data;
    },
    enabled: !!subredditId,
  });
};

export const usePostsFeed = (feedType: "home" | "popular" | "new" = "home") => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.posts.feed(feedType),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/posts?feed=${feedType}`);
      return response.data;
    },
  });
};

// MUTATION HOOKS
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async (postData: CreatePostData) => {
      const api = await getApi();
      const response = await api.post("/posts", postData);
      return response.data;
    },
    onSuccess: (newPost) => {
      // Invalidate and refetch posts lists
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.feed("home") });

      // If we know the subreddit, invalidate that too
      if (newPost.subredditId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.posts.bySubreddit(newPost.subredditId),
        });
      }
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async ({
      postId,
      data,
    }: {
      postId: string;
      data: UpdatePostData;
    }) => {
      const api = await getApi();
      const response = await api.patch(`/posts/${postId}`, data);
      return response.data;
    },
    onSuccess: (updatedPost, variables) => {
      // Update the specific post in cache
      queryClient.setQueryData(
        queryKeys.posts.detail(variables.postId),
        updatedPost
      );

      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async (postId: string) => {
      const api = await getApi();
      const response = await api.delete(`/posts/${postId}`);
      return response.data;
    },
    onSuccess: (_, postId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(postId) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Invalidate all post-related queries
    },
  });
};

export const useVotePost = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async ({
      postId,
      dir,
    }: {
      postId: string;
      dir: 1 | -1 | 0;
    }) => {
      const api = await getApi();
      const response = await api.post(`/posts/${postId}/vote`, { dir });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific post and lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(variables.postId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
    // Optimistic updates for better UX
    onMutate: async ({ postId, dir }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts.detail(postId),
      });

      // Snapshot the previous value
      const previousPost = queryClient.getQueryData(
        queryKeys.posts.detail(postId)
      );

      // Optimistically update the cache
      queryClient.setQueryData(queryKeys.posts.detail(postId), (old: any) => {
        if (!old) return old;

        return {
          ...old,
          userVote: dir,
          upvotes: old.upvotes + (dir === 1 ? 1 : dir === -1 ? -1 : 0),
        };
      });

      return { previousPost };
    },
    onError: (_, variables, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(
          queryKeys.posts.detail(variables.postId),
          context.previousPost
        );
      }
    },
  });
};

export const useTagPostNsfw = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async (postId: string) => {
      const api = await getApi();
      const response = await api.patch(`/posts/${postId}/nsfw`);
      return response.data;
    },
    onSuccess: (_, postId) => {
      // Invalidate the specific post to refresh its NSFW status
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(postId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
};

export const useTagPostSpoiler = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async (postId: string) => {
      const api = await getApi();
      const response = await api.patch(`/posts/${postId}/spoiler`);
      return response.data;
    },
    onSuccess: (_, postId) => {
      // Invalidate the specific post to refresh its spoiler status
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(postId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
};
