import express from "express";
import authenticate from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/", authenticate);

export default router;
