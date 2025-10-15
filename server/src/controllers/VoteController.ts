import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import VoteModel from "../models/Vote";
import UserModel from "../models/User";
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
      let { userId: clerkUserId } = getAuth(req) || {};

      if (!clerkUserId) {
        clerkUserId = req.body.userId;
      }
      if (!clerkUserId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Find the user in our database to get their MongoDB ObjectId
      const user = await UserModel.findOne({ clerkId: clerkUserId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userId = user._id.toString();

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

      let scoreChange = 0;

      if (dir === 0) {
        // clear vote
        if (existingVote) {
          scoreChange = -existingVote.value; // reverse previous vote
          await existingVote.deleteOne();
        }
      } else {
        if (existingVote) {
          // update existing
          scoreChange = dir - existingVote.value; // difference between new and old vote
          existingVote.value = dir;
          await existingVote.save();
        } else {
          // create new vote
          scoreChange = dir;
          await VoteModel.create({
            userId,
            postId: postId || undefined,
            commentId: commentId || undefined,
            value: dir,
          });
        }
      }

      if (postId) {
        const post = await PostModel.findById(postId);
        await UserModel.findByIdAndUpdate(post?.authorId, {
          $inc: { "karma.post": scoreChange },
        });
      } else if (commentId) {
        const comment = await CommentModel.findById(commentId);
        await UserModel.findByIdAndUpdate(comment?.authorId, {
          $inc: { "karma.comment": scoreChange },
        });
      }

      return res.json({ success: true });
    } catch (error) {
      console.error("vote error", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};
