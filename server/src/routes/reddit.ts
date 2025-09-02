import express from "express";
import axios from "axios";

const router = express.Router();

const REDDIT_API_BASE = "https://www.reddit.com";

const redditApi = axios.create({
  baseURL: REDDIT_API_BASE,
  headers: {
    "User-Agent": "RedditClone/1.0.0 (by /u/redditclone)",
  },
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

router.get("/posts/:sort", async (req, res) => {
  try {
    const { sort } = req.params;
    const query = req.query;

    const params = {
      limit: 25,
      raw_json: 1,
      ...query,
    };

    const queryString = buildQueryString(params);
    const url = `/${sort}.json${queryString ? `?${queryString}` : ""}`;

    const response = await redditApi.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching Reddit posts:", error);
    res.status(500).json({ error: "Failed to fetch posts from Reddit" });
  }
});

router.get("/r/:subreddit/:sort", async (req, res) => {
  try {
    const { subreddit, sort } = req.params;
    const query = req.query;

    const params = {
      limit: 25,
      raw_json: 1,
      ...query,
    };

    const queryString = buildQueryString(params);
    const url = `/r/${subreddit}/${sort}.json${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await redditApi.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching subreddit posts:", error);
    res.status(500).json({ error: "Failed to fetch subreddit posts" });
  }
});

router.get("/by_id/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const url = `/by_id/${postId}.json?raw_json=1`;

    const response = await redditApi.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

router.get("/r/:subreddit/comments/:postId", async (req, res) => {
  try {
    const { subreddit, postId } = req.params;
    const query = req.query;

    const params = {
      limit: 100,
      raw_json: 1,
      ...query,
    };

    const queryString = buildQueryString(params);
    const url = `/r/${subreddit}/comments/${postId}.json${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await redditApi.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

router.get("/r/:subreddit/about", async (req, res) => {
  try {
    const { subreddit } = req.params;
    const url = `/r/${subreddit}/about.json?raw_json=1`;

    const response = await redditApi.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching subreddit info:", error);
    res.status(500).json({ error: "Failed to fetch subreddit info" });
  }
});

router.get("/subreddits/popular", async (req, res) => {
  try {
    const query = req.query;

    const params = {
      limit: 25,
      raw_json: 1,
      ...query,
    };

    const queryString = buildQueryString(params);
    const url = `/subreddits/popular.json${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await redditApi.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching popular subreddits:", error);
    res.status(500).json({ error: "Failed to fetch popular subreddits" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query;

    const params = {
      raw_json: 1,
      ...query,
    };

    const queryString = buildQueryString(params);
    const url = `/search.json?${queryString}`;

    const response = await redditApi.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error searching Reddit:", error);
    res.status(500).json({ error: "Failed to search Reddit" });
  }
});

export default router;
