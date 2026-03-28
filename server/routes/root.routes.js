import express from "express";
import root from "../controllers/root.controller.js"
const router = express.Router();

router.get("/", root);

export default router;
