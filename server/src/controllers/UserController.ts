import { Request, Response } from "express";
import UserModel from "../models/User";
import PostModel from "../models/Post";
import CommentModel from "../models/Comment";
import { getAuth } from "@clerk/express";
//getbyid-change name
const UserController = {
  async get(req: Request, res: Response) {
    try {
      const user = await UserModel.findById(req.params.userId);

      if (!user) {
        return res
          .status(404)
          .json({ sucess: false, message: "User not found" });
      }
      res.json({
        data: user,
        success: true,
      });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  async getAll(req: Request, res: Response) {
    try {
      const Users = (await UserModel.find({})) || [];
      res.json({
        data: Users,
        success: true,
      });
    } catch (error) {
      console.error("cant get", error);
      res.status(500).json({ message: "server error during get function" });
    }
  },
  //? consider changing the username editing and moderator to not be changable by the user
  async edit(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      // Allow fallback to body param for development/testing
      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await UserModel.findById(req.params.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Only allow editing own profile
      if (user._id.toString() !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // List all editable fields
      const {
        username,
        displayName,
        about,
        socialLinks,
        isMature,
        isModerator,
        avatarUrl,
        bannerUrl,
        gender,
      } = req.body;

      // Only update fields if provided
      if (username !== undefined) user.username = username;
      if (displayName !== undefined) user.displayName = displayName;
      if (about !== undefined) user.about = about;
      if (socialLinks !== undefined) user.socialLinks = socialLinks;
      if (isMature !== undefined) user.isMature = isMature;
      if (isModerator !== undefined) user.isModerator = isModerator;
      if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
      if (bannerUrl !== undefined) user.bannerUrl = bannerUrl;
      if (gender !== undefined) user.gender = gender;

      await user.save();

      res.json({ success: true, data: user });
    } catch (error) {
      console.error("cant edit", error);
      res.status(500).json({ message: "server error during edit" });
    }
  },
  async getOverview(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, message: "User ID is required" });
      }
      const posts = await PostModel.find({ authorId: userId }).lean();
      const comments = await CommentModel.find({ authorId: userId }).lean();

      const normalizedPosts = posts.map((p) => ({
        type: "post",
        id: p._id,
        content: p.content,
        createdAt: p.createdAt,
      }));

      const normalizedComments = comments.map((c) => ({
        type: "comment",
        id: c._id,
        content: c.content,
        createdAt: c.createdAt,
      }));

      const overview = [...normalizedPosts, ...normalizedComments].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      res.json({ success: true, data: overview });
    } catch (error) {
      console.error("Error fetching overview:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching overview",
      });
    }
  },
};

export default UserController;
