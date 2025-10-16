import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { useAuthenticatedApi } from "../services/backendApi";
import { queryKeys } from "./queryKeys";

export interface CreatePostData {
  title: string;
  content: {
    type: "text" | "image" | "video" | "link";
    value: string;
  };
  subredditId: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
}

export const usePosts = () => {
  const getApi = useAuthenticatedApi();
  const { isLoaded } = useAuth();

  return useQuery({
    queryKey: queryKeys.posts.all,
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get("/posts");
      return response.data;
    },
    enabled: isLoaded, // Wait for auth to be loaded before fetching
  });
};

export const usePost = (postId: string) => {
  const getApi = useAuthenticatedApi();
  const { isLoaded } = useAuth();

  return useQuery({
    queryKey: queryKeys.posts.detail(postId),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/posts/${postId}`);
      return response.data.data;
    },
    enabled: !!postId && isLoaded, // Wait for auth to be loaded
  });
};

export const usePostsBySubreddit = (subredditId: string) => {
  const getApi = useAuthenticatedApi();
  const { isLoaded } = useAuth();

  return useQuery({
    queryKey: queryKeys.posts.bySubreddit(subredditId),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/posts?subredditId=${subredditId}`);
      return response.data;
    },
    enabled: !!subredditId && isLoaded, // Wait for auth to be loaded
  });
};

export const usePostsFeed = (feedType: "home" | "popular" | "new" = "home") => {
  const getApi = useAuthenticatedApi();
  const { isLoaded } = useAuth();

  return useQuery({
    queryKey: queryKeys.posts.feed(feedType),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/posts?feed=${feedType}`);
      return response.data;
    },
    enabled: isLoaded, // Wait for auth to be loaded before fetching
  });
};

export const usePostsSort = (
  sortType: "hot" | "new" | "top" | "rising" | "controversial" = "hot",
  timeFilter?: "hour" | "day" | "week" | "month" | "year" | "all"
) => {
  const getApi = useAuthenticatedApi();
  const { isLoaded } = useAuth();

  return useQuery({
    queryKey: ["posts", "sort", sortType, timeFilter],
    queryFn: async () => {
      const api = await getApi();
      const params = new URLSearchParams({ sort: sortType });
      if (timeFilter) {
        params.append("t", timeFilter);
      }
      const response = await api.get(`/posts?${params.toString()}`);
      return response.data;
    },
    enabled: isLoaded, // Wait for auth to be loaded before fetching
  });
};

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
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.feed("home") });

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
      queryClient.setQueryData(
        queryKeys.posts.detail(variables.postId),
        updatedPost
      );

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
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(postId) });

      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(variables.postId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
    onMutate: async ({ postId, dir }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts.detail(postId),
      });
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.all });
      await queryClient.cancelQueries({ queryKey: ["posts"] }); // Catch any other posts queries

      const previousPost = queryClient.getQueryData(
        queryKeys.posts.detail(postId)
      );

      // Helper function to update a post's vote counts
      const updatePostVotes = (post: any) => {
        if (!post || post._id !== postId) return post;

        const oldVote = post.userVote || 0;
        let upvotesChange = 0;
        let downvotesChange = 0;

        // Calculate changes based on vote transition
        if (oldVote === 1) {
          // Was upvoted
          if (dir === 1) {
            // Remove upvote (toggle off)
            upvotesChange = -1;
          } else if (dir === -1) {
            // Switch to downvote
            upvotesChange = -1;
            downvotesChange = 1;
          } else {
            // dir === 0, clear vote
            upvotesChange = -1;
          }
        } else if (oldVote === -1) {
          // Was downvoted
          if (dir === 1) {
            // Switch to upvote
            upvotesChange = 1;
            downvotesChange = -1;
          } else if (dir === -1) {
            // Remove downvote (toggle off)
            downvotesChange = -1;
          } else {
            // dir === 0, clear vote
            downvotesChange = -1;
          }
        } else {
          // Was not voted
          if (dir === 1) {
            upvotesChange = 1;
          } else if (dir === -1) {
            downvotesChange = 1;
          }
        }

        return {
          ...post,
          userVote: dir,
          upvotes: post.upvotes + upvotesChange,
          downvotes: post.downvotes + downvotesChange,
        };
      };

      // Update single post detail view
      queryClient.setQueryData(queryKeys.posts.detail(postId), (old: any) => {
        if (!old) return old;
        return updatePostVotes(old);
      });

      // Update post in all list views (feed, all posts, etc.)
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: any) => {
        if (!old) return old;

        // Handle array of posts
        if (Array.isArray(old)) {
          return old.map(updatePostVotes);
        }

        // Handle response with data array
        if (old.data && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map(updatePostVotes),
          };
        }

        return old;
      });

      return { previousPost };
    },
    onError: (_, variables, context) => {
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(postId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    },
  });
};
