import express from "express";
import CommentController from "../controllers/CommentController";
import { VoteController } from "../controllers/VoteController";

const router = express.Router();
//create nested comment
router.post("/:commentId/replies", CommentController.createReply);
//edit comment
router.patch("/:commentId", CommentController.edit);
//soft delete comment
router.patch("/:commentId/delete", CommentController.deleteComment);
//moderator remove comment
router.patch("/:commentId/remove", CommentController.removeComment);
//vote on comment
//! works by setting a dir variable in the body , 1 is upvote -1 is downvote 0 is clearing a vote
router.post("/:commentId/vote", VoteController.vote);
export default router;
