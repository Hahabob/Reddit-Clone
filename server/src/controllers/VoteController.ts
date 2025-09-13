import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import VoteModel from "../models/Vote";
import PostModel from "../models/Post";
import CommentModel from "../models/Comment";

interface IVoteQuery {
  userId: string;
  postId?: string;
  commentId?: string;
}

export const VoteController = {
  async vote(req: Request, res: Response) {
    try {
      let { userId } = getAuth(req) || {};

      if (!userId) {
        userId = req.body.userId;
      }
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { postId, commentId } = req.params;
      const { dir } = req.body;

      if (![1, -1, 0].includes(dir)) {
        return res.status(400).json({ message: "Invalid vote direction" });
      }

      if (!postId && !commentId) {
        return res
          .status(400)
          .json({ message: "Must target a post or comment" });
      }

      const query: IVoteQuery = { userId };
      if (postId) query.postId = postId;
      if (commentId) query.commentId = commentId;

      const existingVote = await VoteModel.findOne(query);

      if (dir === 0) {
        // clear vote
        if (existingVote) {
          await existingVote.deleteOne();
        }
      } else {
        if (existingVote) {
          // update existing
          existingVote.value = dir;
          await existingVote.save();
        } else {
          // create new vote
          await VoteModel.create({
            userId,
            postId: postId || undefined,
            commentId: commentId || undefined,
            value: dir,
          });
        }
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("vote error", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};
