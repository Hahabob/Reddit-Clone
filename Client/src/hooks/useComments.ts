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
      return response.data.data || response.data;
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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byPost(variables.postId),
        refetchType: "active",
      });

      setTimeout(() => {
        queryClient.refetchQueries({
          queryKey: queryKeys.comments.byPost(variables.postId),
        });
      }, 100);

      if (variables.commentData.parentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.comments.replies(variables.commentData.parentId),
        });
      }

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
      queryClient.setQueryData(
        queryKeys.comments.detail(variables.commentId),
        updatedComment
      );

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
      queryClient.removeQueries({
        queryKey: queryKeys.comments.detail(commentId),
      });

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
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.detail(variables.commentId),
      });

      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onMutate: async ({ commentId, dir }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.comments.detail(commentId),
      });
      await queryClient.cancelQueries({ queryKey: ["comments"] });

      const previousComment = queryClient.getQueryData(
        queryKeys.comments.detail(commentId)
      );

      // Helper function to update a comment's vote counts recursively
      const updateCommentVotes = (comment: any): any => {
        if (!comment) return comment;

        // Update this comment if it matches
        if (comment._id === commentId) {
          const oldVote = comment.userVote || 0;
          let upvotesChange = 0;
          let downvotesChange = 0;

          // Calculate changes based on vote transition
          if (oldVote === 1) {
            if (dir === 1) {
              upvotesChange = -1;
            } else if (dir === -1) {
              upvotesChange = -1;
              downvotesChange = 1;
            } else {
              upvotesChange = -1;
            }
          } else if (oldVote === -1) {
            if (dir === 1) {
              upvotesChange = 1;
              downvotesChange = -1;
            } else if (dir === -1) {
              downvotesChange = -1;
            } else {
              downvotesChange = -1;
            }
          } else {
            if (dir === 1) {
              upvotesChange = 1;
            } else if (dir === -1) {
              downvotesChange = 1;
            }
          }

          return {
            ...comment,
            userVote: dir,
            upvotes: comment.upvotes + upvotesChange,
            downvotes: comment.downvotes + downvotesChange,
            replies: comment.replies?.map(updateCommentVotes) || [],
          };
        }

        // Recursively update replies
        if (comment.replies && Array.isArray(comment.replies)) {
          return {
            ...comment,
            replies: comment.replies.map(updateCommentVotes),
          };
        }

        return comment;
      };

      // Update single comment detail view
      queryClient.setQueryData(
        queryKeys.comments.detail(commentId),
        (old: any) => {
          if (!old) return old;
          return updateCommentVotes(old);
        }
      );

      // Update comment in all list views (including nested replies)
      queryClient.setQueriesData({ queryKey: ["comments"] }, (old: any) => {
        if (!old) return old;

        // Handle array of comments
        if (Array.isArray(old)) {
          return old.map(updateCommentVotes);
        }

        // Handle response with data array
        if (old.data && Array.isArray(old.data)) {
          return {
            ...old,
            data: old.data.map(updateCommentVotes),
          };
        }

        return old;
      });

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
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.replies(variables.commentId),
      });

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
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.detail(commentId),
      });
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

export const usePostCommentCount = (postId: string) => {
  const { data: comments } = useComments(postId);
  return comments ? comments.length : 0;
};
