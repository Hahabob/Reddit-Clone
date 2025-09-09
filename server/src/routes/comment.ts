import express from "express";
import CommentController from "../controllers/CommentController";

const router = express.Router();

router.post("/:commentId/replies", CommentController.createReply);

//todo voting needs implementation
//upvote comment
// router.post("/:commentId/upvote", voteController.upvote);
//downvote comment
// router.post("/:commentId/downvote", voteController.downvote);
export default router;
