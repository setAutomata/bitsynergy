import express from "express";
import chats from "../controllers/chats.controller.js";

const router = express.Router();

router.post("/", chats);

export default router;
