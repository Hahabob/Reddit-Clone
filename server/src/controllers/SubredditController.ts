import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import SubredditModel from "../models/Subreddit";
import PostModel from "../models/Post"; // long schema model
import UserModel from "../models/User";

const SubredditController = {
  async get(req: Request, res: Response) {
    try {
      const subreddit = await SubredditModel.findById(req.params.subredditId);

      if (!subreddit) {
        return res
          .status(404)
          .json({ sucess: false, message: "Subreddit not found" });
      }
      res.json({
        data: subreddit,
        success: true,
      });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  //todo implement get subreddits by topics.
  async getAll(req: Request, res: Response) {
    try {
      const Subreddits =
        //?check if the memebers thing is actually sorting by how many members there are.
        (await SubredditModel.find({}).sort({ members: -1 })) || [];

      res.json({
        data: Subreddits,
        success: true,
      });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  async create(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const {
        name,
        description,
        iconUrl,
        bannerUrl,
        isNSFW,
        isPrivate,
        topics,
      } = req.body;

      if (!name || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newSubreddit = await SubredditModel.create({
        name,
        description,
        iconUrl: iconUrl ?? "",
        bannerUrl: bannerUrl ?? "",
        isNSFW: isNSFW ?? false,
        isPrivate: isPrivate ?? false,
        members: [userId],
        moderators: [userId],
        topics,
        createdAt: new Date(),
      });
      return res.status(201).json(newSubreddit);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  },
  //? maybe implement the widgets and all the other editable stuff communities have later.
  //currently edits only the description
  async edit(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const subreddit = await SubredditModel.findById(req.params.subredditId);
      if (!subreddit) {
        return res.status(404).json({ message: "Subreddit not found" });
      }
      if (!subreddit.moderators.toString().includes(userId)) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { description } = req.body;
      subreddit.description = description ?? subreddit.description;
      await subreddit.save();
      res.json({ success: true, data: subreddit });
    } catch (error) {
      console.error("cant edit", error);
      res.status(500).json({ message: "server error during edit" });
    }
  },
  async join(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const subreddit = await SubredditModel.findById(req.params.subredditId);
      if (!subreddit) {
        return res.status(404).json({ message: "Subreddit not found" });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!subreddit.members.includes(user._id)) {
        subreddit.members.push(user._id);
      }

      await subreddit.save();
    } catch (error) {
      console.error("Error joining subreddit:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
  async leave(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const subreddit = await SubredditModel.findById(req.params.subredditId);
      if (!subreddit) {
        return res.status(404).json({ message: "Subreddit not found" });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!subreddit.members.includes(user._id)) {
        subreddit.members = subreddit.members.filter(
          (memberId) => memberId.toString() !== user._id.toString()
        );
      }

      await subreddit.save();
    } catch (error) {
      console.error("Error leaving subreddit:", error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },
  //todo implement sorting
  async getPosts(req: Request, res: Response) {
    try {
      const Posts =
        (await PostModel.find({ subredditId: req.params.subredditId })) || [];
      res.json({
        data: Posts,
        success: true,
      });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  //todo implement mod promotion and demotion
};

export default SubredditController;
