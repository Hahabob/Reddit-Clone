import express from "express";

const router = express.Router();
//Get user profile
router.get("/:userId");
//List users
router.get("/");
//Update user info
router.put("/:userId");
//Delete user (admin only)
router.delete("/:userId");
