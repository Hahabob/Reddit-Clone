import experss from "express";

const router = experss.Router();

router.get("/posts/:postId/comments");

router.post("/posts/:postId/comments");

router.get("/comments/:id/replies");

router.put("/comments/:id");

router.delete("/comments/:id");

router.post("/comments/:id/upvote");

router.post("/comments/:id/downvote");
