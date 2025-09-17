import express from "express";
import refreshToken from "../controllers/refresh.controller.js";
const route = express.Router();

route.get("/", refreshToken);

export default route;
