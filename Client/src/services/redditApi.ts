import axios, { type AxiosResponse } from "axios";
import type {
  RedditPostsResponse,
  RedditCommentsResponse,
  RedditSubredditsResponse,
  RedditPost,
  RedditSubreddit,
  RedditUser,
  RedditPostsQuery,
  RedditCommentsQuery,
  RedditSubredditsQuery,
} from "../types/reddit";

// Base URL for our server proxy
const REDDIT_API_BASE = "http://localhost:3001/api/reddit";

// Create axios instance with default config
const redditApi = axios.create({
  baseURL: REDDIT_API_BASE,
});

// Helper function to build query string
const buildQueryString = (
  params: Record<string, string | number | boolean | undefined>
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
};

// Posts API
export const postsApi = {
  // Get posts from a specific subreddit
  getSubredditPosts: async (
    subreddit: string,
    sort: "hot" | "new" | "rising" | "top" | "controversial" = "hot",
    query?: RedditPostsQuery
  ): Promise<RedditPostsResponse> => {
    const params = {
      limit: 25,
      raw_json: 1,
      ...query,
    };

    const queryString = buildQueryString(params);
    const url = `/r/${subreddit}/${sort}${
      queryString ? `?${queryString}` : ""
    }`;

    const response: AxiosResponse<RedditPostsResponse> = await redditApi.get(
      url
    );
    return response.data;
  },

  // Get posts from home feed (popular posts)
  getHomePosts: async (
    sort: "hot" | "new" | "rising" | "top" | "controversial" = "hot",
    query?: RedditPostsQuery
  ): Promise<RedditPostsResponse> => {
    const params = {
      limit: 25,
      raw_json: 1,
      ...query,
    };

    const queryString = buildQueryString(params);
    const url = `/posts/${sort}${queryString ? `?${queryString}` : ""}`;

    const response: AxiosResponse<RedditPostsResponse> = await redditApi.get(
      url
    );
    return response.data;
  },

  // Get a specific post by ID
  getPost: async (postId: string): Promise<RedditPost> => {
    const response: AxiosResponse<RedditPostsResponse> = await redditApi.get(
      `/by_id/${postId}`
    );

    if (response.data.data.children.length === 0) {
      throw new Error("Post not found");
    }

    return response.data.data.children[0].data;
  },

  // Search posts
  searchPosts: async (
    query: string,
    sort: "relevance" | "hot" | "top" | "new" | "comments" = "relevance",
    time: "hour" | "day" | "week" | "month" | "year" | "all" = "all",
    limit: number = 25
  ): Promise<RedditPostsResponse> => {
    const params = {
      q: query,
      sort,
      t: time,
      limit,
      raw_json: 1,
    };

    const queryString = buildQueryString(params);
    const url = `/search?${queryString}`;

    const response: AxiosResponse<RedditPostsResponse> = await redditApi.get(
      url
    );
    return response.data;
  },
};

// Comments API
export const commentsApi = {
  // Get comments for a specific post
  getPostComments: async (
    subreddit: string,
    postId: string,
    query?: RedditCommentsQuery
  ): Promise<RedditCommentsResponse> => {
    const params = {
      limit: 100,
      raw_json: 1,
      ...query,
    };

    const queryString = buildQueryString(params);
    const url = `/r/${subreddit}/comments/${postId}${
      queryString ? `?${queryString}` : ""
    }`;

    const response: AxiosResponse<RedditCommentsResponse> = await redditApi.get(
      url
    );
    return response.data;
  },

  // Get more comments (for expanding comment threads)
  getMoreComments: async (
    linkId: string,
    children: string[],
    sort:
      | "confidence"
      | "top"
      | "new"
      | "controversial"
      | "old"
      | "random"
      | "qa" = "confidence"
  ): Promise<RedditCommentsResponse> => {
    const params = {
      link_id: linkId,
      children: children.join(","),
      sort,
      raw_json: 1,
    };

    const queryString = buildQueryString(params);
    const url = `/api/morechildren.json?${queryString}`;

    const response: AxiosResponse<RedditCommentsResponse> = await redditApi.get(
      url
    );
    return response.data;
  },
};

// Subreddits API
export const subredditsApi = {
  // Get popular subreddits
  getPopular: async (
    query?: RedditSubredditsQuery
  ): Promise<RedditSubredditsResponse> => {
    const params = {
      limit: 25,
      raw_json: 1,
      ...query,
    };

    const queryString = buildQueryString(params);
    const url = `/subreddits/popular${queryString ? `?${queryString}` : ""}`;

    const response: AxiosResponse<RedditSubredditsResponse> =
      await redditApi.get(url);
    return response.data;
  },

  // Get new subreddits
  getNew: async (
    query?: RedditSubredditsQuery
  ): Promise<RedditSubredditsResponse> => {
    const params = {
      limit: 25,
      raw_json: 1,
      ...query,
    };

    const queryString = buildQueryString(params);
    const url = `/subreddits/new.json${queryString ? `?${queryString}` : ""}`;

    const response: AxiosResponse<RedditSubredditsResponse> =
      await redditApi.get(url);
    return response.data;
  },

  // Get default subreddits
  getDefault: async (
    query?: RedditSubredditsQuery
  ): Promise<RedditSubredditsResponse> => {
    const params = {
      limit: 25,
      raw_json: 1,
      ...query,
    };

    const queryString = buildQueryString(params);
    const url = `/subreddits/default.json${
      queryString ? `?${queryString}` : ""
    }`;

    const response: AxiosResponse<RedditSubredditsResponse> =
      await redditApi.get(url);
    return response.data;
  },

  // Get a specific subreddit
  getSubreddit: async (subredditName: string): Promise<RedditSubreddit> => {
    const response: AxiosResponse<{ data: RedditSubreddit }> =
      await redditApi.get(`/r/${subredditName}/about.json?raw_json=1`);

    return response.data.data;
  },

  // Search subreddits
  searchSubreddits: async (
    query: string,
    limit: number = 25
  ): Promise<RedditSubredditsResponse> => {
    const params = {
      q: query,
      limit,
      raw_json: 1,
    };

    const queryString = buildQueryString(params);
    const url = `/subreddits/search.json?${queryString}`;

    const response: AxiosResponse<RedditSubredditsResponse> =
      await redditApi.get(url);
    return response.data;
  },

  // Get subreddit posts
  getSubredditPosts: async (
    subredditName: string,
    sort: "hot" | "new" | "rising" | "top" | "controversial" = "hot",
    query?: RedditPostsQuery
  ): Promise<RedditPostsResponse> => {
    return postsApi.getSubredditPosts(subredditName, sort, query);
  },
};

// Users API
export const usersApi = {
  // Get user profile
  getUser: async (username: string): Promise<RedditUser> => {
    const response: AxiosResponse<{ data: RedditUser }> = await redditApi.get(
      `/user/${username}/about.json?raw_json=1`
    );

    return response.data.data;
  },

  // Get user's posts
  getUserPosts: async (
    username: string,
    sort: "hot" | "new" | "top" | "controversial" = "hot",
    time: "hour" | "day" | "week" | "month" | "year" | "all" = "all",
    limit: number = 25
  ): Promise<RedditPostsResponse> => {
    const params = {
      sort,
      t: time,
      limit,
      raw_json: 1,
    };

    const queryString = buildQueryString(params);
    const url = `/user/${username}/submitted.json?${queryString}`;

    const response: AxiosResponse<RedditPostsResponse> = await redditApi.get(
      url
    );
    return response.data;
  },

  // Get user's comments
  getUserComments: async (
    username: string,
    sort: "hot" | "new" | "top" | "controversial" = "hot",
    time: "hour" | "day" | "week" | "month" | "year" | "all" = "all",
    limit: number = 25
  ): Promise<RedditCommentsResponse> => {
    const params = {
      sort,
      t: time,
      limit,
      raw_json: 1,
    };

    const queryString = buildQueryString(params);
    const url = `/user/${username}/comments.json?${queryString}`;

    const response: AxiosResponse<RedditCommentsResponse> = await redditApi.get(
      url
    );
    return response.data;
  },
};

// Main API object
export const redditApiService = {
  posts: postsApi,
  comments: commentsApi,
  subreddits: subredditsApi,
  users: usersApi,
};

export default redditApiService;
