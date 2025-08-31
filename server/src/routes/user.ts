import express from "express";

const router = express.Router();

router.get("/users/:id");

router.get("/users");

router.put("/users/:id");

router.delete("/users/:id");
