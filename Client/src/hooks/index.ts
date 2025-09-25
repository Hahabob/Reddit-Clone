/**
 * Centralized export for all API hooks
 * This provides clean imports: import { usePosts, useCreatePost } from '@/hooks'
 */

// Post hooks
export {
  usePosts,
  usePost,
  usePostsBySubreddit,
  usePostsFeed,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useVotePost,
} from "./usePosts";

// Comment hooks
export {
  useComments,
  useComment,
  useCommentReplies,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useVoteComment,
} from "./useComments";

// User hooks
export {
  useUser,
  useUserProfile,
  useCurrentUser,
  useUpdateUser,
  useFollowUser,
  useUnfollowUser,
} from "./useUsers";

// Subreddit hooks
export {
  useSubreddits,
  useSubreddit,
  usePopularSubreddits,
  useJoinedSubreddits,
  useCreateSubreddit,
  useUpdateSubreddit,
  useJoinSubreddit,
  useLeaveSubreddit,
} from "./useSubreddits";

// Search hooks
export {
  useSearchPosts,
  useSearchSubreddits,
  useSearchUsers,
  useSearchAll,
  useDebounceSearch,
} from "./useSearch";

// Core services (for advanced usage)
export { useAuthenticatedApi } from "../services/backendApi";
export { queryKeys } from "../services/queryKeys";

// Types (re-export for convenience)
export type { BackendUser } from "../services/backendApi";
export type { CreatePostData, UpdatePostData } from "./usePosts";
export type { CreateCommentData, UpdateCommentData } from "./useComments";
export type { UpdateUserData } from "./useUsers";
export type { CreateSubredditData, UpdateSubredditData } from "./useSubreddits";
export type { SearchOptions } from "./useSearch";
