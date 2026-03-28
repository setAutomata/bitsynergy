import express from "express";
import changeTitle from "../controllers/updateTitle.controller.js";

const router = express.Router();

router.put("/", changeTitle);

export default router;
