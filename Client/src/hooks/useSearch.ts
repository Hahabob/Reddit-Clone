import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedApi } from "../services/backendApi";
import { queryKeys } from "../services/queryKeys";

// Types
export interface SearchOptions {
  sort?: "relevance" | "new" | "top";
  time?: "hour" | "day" | "week" | "month" | "year" | "all";
  subreddit?: string;
}

// QUERY HOOKS
export const useSearchPosts = (query: string, options: SearchOptions = {}) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.search.posts(query),
    queryFn: async () => {
      const api = await getApi();
      const params = new URLSearchParams({
        q: query,
        type: "posts",
        ...options,
      });
      const response = await api.get(`/search?${params}`);
      return response.data;
    },
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes - search results don't change often
  });
};

export const useSearchSubreddits = (query: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.search.subreddits(query),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/search/subreddits?q=${query}`);
      return response.data;
    },
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchUsers = (query: string) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.search.users(query),
    queryFn: async () => {
      const api = await getApi();
      const response = await api.get(`/search/users?q=${query}`);
      return response.data;
    },
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchAll = (query: string, options: SearchOptions = {}) => {
  const getApi = useAuthenticatedApi();

  return useQuery({
    queryKey: queryKeys.search.all(query),
    queryFn: async () => {
      const api = await getApi();
      const params = new URLSearchParams({
        q: query,
        type: "all",
        ...options,
      });
      const response = await api.get(`/search?${params}`);
      return response.data;
    },
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
};

// Debounced search hook for instant search
export const useDebounceSearch = (query: string, delay: number = 300) => {
  const [debouncedQuery, setDebouncedQuery] = React.useState(query);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [query, delay]);

  return debouncedQuery;
};
