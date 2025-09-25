/**
 * Centralized query keys for React Query
 * This ensures consistent cache keys across the application
 */

export const queryKeys = {
  // User-related queries
  users: {
    all: ["users"] as const,
    detail: (userId: string) => ["users", userId] as const,
    profile: (userId: string) => ["users", userId, "profile"] as const,
  },

  // Post-related queries
  posts: {
    all: ["posts"] as const,
    detail: (postId: string) => ["posts", postId] as const,
    bySubreddit: (subredditId: string) =>
      ["posts", "subreddit", subredditId] as const,
    byUser: (userId: string) => ["posts", "user", userId] as const,
    feed: (feedType: string) => ["posts", "feed", feedType] as const,
  },

  // Comment-related queries
  comments: {
    all: ["comments"] as const,
    byPost: (postId: string) => ["comments", "post", postId] as const,
    detail: (commentId: string) => ["comments", commentId] as const,
    replies: (commentId: string) => ["comments", commentId, "replies"] as const,
  },

  // Subreddit-related queries
  subreddits: {
    all: ["subreddits"] as const,
    detail: (subredditName: string) => ["subreddits", subredditName] as const,
    joined: (userId: string) => ["subreddits", "joined", userId] as const,
    popular: ["subreddits", "popular"] as const,
  },

  // Search-related queries
  search: {
    posts: (query: string) => ["search", "posts", query] as const,
    subreddits: (query: string) => ["search", "subreddits", query] as const,
    users: (query: string) => ["search", "users", query] as const,
    all: (query: string) => ["search", "all", query] as const,
  },

  // Vote-related queries
  votes: {
    byUser: (userId: string) => ["votes", "user", userId] as const,
    byPost: (postId: string) => ["votes", "post", postId] as const,
  },
} as const;

// Type helper for query keys
export type QueryKeys = typeof queryKeys;
