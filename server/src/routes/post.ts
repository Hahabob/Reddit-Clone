import express from "express";
import PostController from "../controllers/PostController";

const router = express.Router();
//List all posts; supports query params: feed=home, communityId=<id>, `sort=new
// router.get("/posts");
// //Get single post with comments
// router.get("/posts/:id");
//Create new post
router.post("/", PostController.create);
//Edit post
// router.put("/posts/:id");
// //Delete post
// router.delete("/posts/:id");
// //Upvote post
// router.post("/posts/:id/upvote");
// //Downvote post
// router.post("/posts/:id/downvote");

export default router;
