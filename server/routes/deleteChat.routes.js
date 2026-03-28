import express from "express";
import deleteChat from "../controllers/deleteChat.controller.js";

const router = express.Router();

router.delete("/:id", deleteChat);

export default router;
