// routes/search.js
import express, { Request, Response } from "express";
import Subreddit from "../models/Subreddit";
import User from "../models/User";

const router = express.Router();

router.get("/subreddits", async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const results = await Subreddit.aggregate([
      {
        $search: {
          index: "subreddits_autocomplete",
          autocomplete: {
            query: q,
            path: "name",
          },
        },
      },
      {
        $project: {
          name: 1,
        },
      },
      { $limit: 4 },
    ]);

    res.json({
      data: results,
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

router.get("/users", async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q) return res.json([]);

  try {
    const results = await User.aggregate([
      {
        $search: {
          index: "users_autocomplete",
          autocomplete: {
            query: q,
            path: "displayName",
          },
        },
      },
      {
        $project: {
          displayName: 1,
        },
      },
      { $limit: 4 },
    ]);

    res.json({
      data: results,
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
