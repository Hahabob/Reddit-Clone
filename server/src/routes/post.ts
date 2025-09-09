import express from "express";
import PostController from "../controllers/PostController";
import CommentController from "../controllers/CommentController";

const router = express.Router();
//List all posts; supports query params: feed=home, communityId=<id>, `sort=new
router.get("/", PostController.getAll);
//Get single post with comments
router.get("/:postId", PostController.get);
//Create new post
router.post("/", PostController.create);
//Edit post only content same as reddit
router.patch("/:postId", PostController.edit);
//Delete post only for development, in reddit deleting a post is adding a delete flag and hiding it from the feed
router.delete("/:postId", PostController.delete);
//Tag post as nsfw
router.patch("/:postId/nsfw", PostController.tagNsfwPost);
//Tag post as spoiler
router.patch("/:postId/spoiler", PostController.tagSpoilerPost);
//comment on post
router.post("/:postId/comments", CommentController.create);
//get comments for post indcluding neseted comments
router.get("/:postId/comments", CommentController.getCommentsForPost);
//Pin post
// router.patch("/:id/pin", PostController.pinPost);
//Archive post
// router.patch("/:id/archive", PostController.archivePost);
//todo voting needs implementation
//upvote post
// router.post("/:postId/upvote", voteController.upvote);
//downvote post
// router.post("/:postId/downvote", voteController.downvote);
export default router;
