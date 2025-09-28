import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApi } from "../services/backendApi";
import { queryKeys } from "../services/queryKeys";

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
      return response.data.data;
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
      await queryClient.cancelQueries({
        queryKey: queryKeys.posts.detail(postId),
      });

      const previousPost = queryClient.getQueryData(
        queryKeys.posts.detail(postId)
      );

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
