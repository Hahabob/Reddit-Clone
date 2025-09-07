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

const REDDIT_API_BASE = "http://localhost:3001/api/reddit";

const redditApi = axios.create({
  baseURL: REDDIT_API_BASE,
});

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

export const postsApi = {
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

  getPost: async (postId: string): Promise<RedditPost> => {
    const response: AxiosResponse<RedditPostsResponse> = await redditApi.get(
      `/by_id/${postId}`
    );

    if (response.data.data.children.length === 0) {
      throw new Error("Post not found");
    }

    return response.data.data.children[0].data;
  },

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

export const commentsApi = {
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

export const subredditsApi = {
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

  getSubreddit: async (subredditName: string): Promise<RedditSubreddit> => {
    const response: AxiosResponse<{ data: RedditSubreddit }> =
      await redditApi.get(`/r/${subredditName}/about.json?raw_json=1`);

    return response.data.data;
  },

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

  getSubredditPosts: async (
    subredditName: string,
    sort: "hot" | "new" | "rising" | "top" | "controversial" = "hot",
    query?: RedditPostsQuery
  ): Promise<RedditPostsResponse> => {
    return postsApi.getSubredditPosts(subredditName, sort, query);
  },
};

export const usersApi = {
  getUser: async (username: string): Promise<RedditUser> => {
    const response: AxiosResponse<{ data: RedditUser }> = await redditApi.get(
      `/user/${username}/about.json?raw_json=1`
    );

    return response.data.data;
  },

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

export const redditApiService = {
  posts: postsApi,
  comments: commentsApi,
  subreddits: subredditsApi,
  users: usersApi,
};

export default redditApiService;
