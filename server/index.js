import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/database.js";
import verify from "./middleware/authMiddleware.js";
import rootRoutes from "./routes/root.routes.js";
import registerRoutes from "./routes/register.routes.js";
import updateAccRoutes from "./routes/updateAcc.routes.js";
import updateTitleRoutes from "./routes/updateTitle.routes.js";
import deleteChatRoutes from "./routes/deleteChat.routes.js";
import deleteAccRoutes from "./routes/deleteAcc.routes.js";
import getUserRoutes from "./routes/users.routes.js";
import getChatRoutes from "./routes/chats.routes.js";
import authenticateRoutes from "./routes/auth.routes.js";
import refreshRoutes from "./routes/refresh.routes.js";
import logoutRoutes from "./routes/logout.routes.js";
import ollamaProxy from "./middleware/ollamaProxy.js";
import updateChat from "./controllers/updateChat.controller.js";

const app = express();
connectDB();

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(express.json());
app.use(cookieParser());

const allowedOrigin = (origin, cb) => {
  if (origin && origin.startsWith("http://")) cb(null, true);
  else cb(new Error("Not allowed by CORS!"));
};

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use("/", rootRoutes);
app.use("/signup", registerRoutes);
app.use("/auth", authenticateRoutes);
app.use("/logout", logoutRoutes);
app.use("/refresh", refreshRoutes);
app.use("/user", getUserRoutes);
app.use("/chats", deleteChatRoutes);
app.use("/chats", getChatRoutes);
app.use("/account", deleteAccRoutes);
app.use("/account", updateAccRoutes);
app.use("/title", updateTitleRoutes);
app.use("/api", verify, ollamaProxy, updateChat);

app.all(/(.*)/, (req, res) => {
  res.status(404).send("404! Page not found");
});

const opt = {
  port: process.env.PORT,
  host: process.env.HOSTNAME,
};

mongoose.connection.once("open", () => {
  console.log("Connection to MongoDB is successful");
  const server = app.listen(opt, () => {
    console.log("Server info: ", server.address());
  });
});
