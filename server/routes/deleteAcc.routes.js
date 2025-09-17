import express from "express";
import deleteAccount from "../controllers/deleteAcc.controller.js";

const router = express.Router();

router.delete("/", deleteAccount);

export default router;
