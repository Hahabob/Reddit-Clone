import express from "express";

const router = express.Router();
//Get all comments for a post
router.get("/posts/:postId/comments");
//Create new comment
router.post("/posts/:postId/comments");
//Get nested replies for a comment
router.get("/comments/:id/replies");
//Edit comment
router.put("/comments/:id");
//Delete comment
router.delete("/comments/:id");
//Upvote comment
router.post("/comments/:id/upvote");
//Downvote comment
router.post("/comments/:id/downvote");
