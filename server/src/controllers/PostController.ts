import { Request, Response } from "express";
import { Post } from "../models/Post"; // long schema model

const PostController = {
  async create(req: Request, res: Response) {
    try {
      const { title, content, communityId } = req.body;
      const author = "req.auth?.userId || req.user?._id;"; // Clerk vs JWT?

      if (!title || !content?.type || !content?.value || !communityId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate allowed content types
      const allowedTypes = ["text", "image", "video", "link"];
      if (!allowedTypes.includes(content.type)) {
        return res
          .status(400)
          .json({ message: `Invalid content type: ${content.type}` });
      }

      const newPost = new Post({
        title,
        content: {
          type: content.type,
          value: content.value,
        },
        author,
        communityId,
        upvotes: 0,
        downvotes: 0,
        comments: [],
        createdAt: new Date(),
      });

      const savedPost = await newPost.save();
      return res.status(201).json(savedPost);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  },
};

export default PostController;
