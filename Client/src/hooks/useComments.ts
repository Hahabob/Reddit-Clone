import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthenticatedApi } from "../services/backendApi";
import { queryKeys } from "../services/queryKeys";

export interface CreateCommentData {
  content: string;
  parentId?: string;
}

export interface UpdateCommentData {
  content: string;
}

export const useComments = (postId: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.comments.byPost(postId),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/posts/${postId}/comments`);
      return response.data;
    },
    enabled: !!postId,
  });
};

export const useComment = (commentId: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.comments.detail(commentId),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/comments/${commentId}`);
      return response.data;
    },
    enabled: !!commentId,
  });
};

export const useCommentReplies = (commentId: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.comments.replies(commentId),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/comments/${commentId}/replies`);
      return response.data;
    },
    enabled: !!commentId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async ({
      postId,
      commentData,
    }: {
      postId: string;
      commentData: CreateCommentData;
    }) => {
      const api = await getApi();
      const response = await api.post(`/posts/${postId}/comments`, commentData);
      return response.data;
    },
    onSuccess: (newComment, variables) => {
      // Invalidate comments for the post
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byPost(variables.postId),
      });

      // If it's a reply, also invalidate parent comment replies
      if (variables.commentData.parentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.replies(variables.commentData.parentId),
        });
      }

      // Update post comment count if available
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(variables.postId),
      });
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async ({
      commentId,
      data,
    }: {
      commentId: string;
      data: UpdateCommentData;
    }) => {
      const api = await getApi();
      const response = await api.patch(`/comments/${commentId}`, data);
      return response.data;
    },
    onSuccess: (updatedComment, variables) => {
      // Update the specific comment in cache
      queryClient.setQueryData(
        queryKeys.comments.detail(variables.commentId),
        updatedComment
      );

      // Invalidate the post's comments to ensure consistency
      if (updatedComment.postId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.byPost(updatedComment.postId),
        });
      }
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const api = await getApi();
      const response = await api.patch(`/comments/${commentId}/delete`);
      return response.data;
    },
    onSuccess: (_, commentId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.comments.detail(commentId),
      });

      // Invalidate all comment-related queries
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

export const useVoteComment = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async ({
      commentId,
      dir,
    }: {
      commentId: string;
      dir: 1 | -1 | 0;
    }) => {
      const api = await getApi();
      const response = await api.post(`/comments/${commentId}/vote`, { dir });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific comment
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.detail(variables.commentId),
      });

      // Invalidate comments lists
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    // Optimistic updates
    onMutate: async ({ commentId, dir }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.detail(commentId),
      });

      const previousComment = queryClient.getQueryData(
        queryKeys.comments.detail(commentId)
      );

      queryClient.setQueryData(
        queryKeys.comments.detail(commentId),
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            userVote: dir,
            upvotes: old.upvotes + (dir === 1 ? 1 : dir === -1 ? -1 : 0),
          };
        }
      );

      return { previousComment };
    },
    onError: (_, variables, context) => {
      if (context?.previousComment) {
        queryClient.setQueryData(
          queryKeys.comments.detail(variables.commentId),
          context.previousComment
        );
      }
    },
  });
};

export const useCreateCommentReply = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async ({
      commentId,
      replyData,
    }: {
      commentId: string;
      replyData: CreateCommentData;
    }) => {
      const api = await getApi();
      const response = await api.post(
        `/comments/${commentId}/replies`,
        replyData
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate replies for the parent comment
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.replies(variables.commentId),
      });

      // Invalidate all comments to refresh counts
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

export const useRemoveComment = () => {
  const queryClient = useQueryClient();
  const getApi = useAuthenticatedApi();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const api = await getApi();
      const response = await api.patch(`/comments/${commentId}/remove`);
      return response.data;
    },
    onSuccess: (_, commentId) => {
      // Invalidate the specific comment and lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.detail(commentId),
      });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};
