import express from "express";
import CommentController from "../controllers/CommentController";

const router = express.Router();
//create nested comment
router.post("/:commentId/replies", CommentController.createReply);
//edit comment
router.patch("/:commentId", CommentController.edit);
//soft delete comment
router.patch("/:commentId/delete", CommentController.deleteComment);
//moderator remove comment
router.patch("/:commentId/remove", CommentController.removeComment);

//todo voting needs implementation
//upvote comment
// router.post("/:commentId/upvote", voteController.upvote);
//downvote comment
// router.post("/:commentId/downvote", voteController.downvote);
export default router;
