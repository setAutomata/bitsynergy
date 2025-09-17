import express from "express";
import changePassword from "../controllers/updateAcc.controller.js";

const router = express.Router();

router.put("/", changePassword);

export default router;
