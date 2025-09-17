import JWT from "jsonwebtoken";
import fs from "node:fs";
import { fileURLToPath } from "url";
import path from "node:path";
import User from "../model/User.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFilePath = path.join(__dirname, "../logs/user-signin.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

function handleLogs(message) {
  console.log(message);
  logStream.write(message + "\n");
}

async function handleAuth(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and Password are required" });

  const user = await User.findOne({ email: email });

  if (user) {
    await user.comparePassword(password, async (error, isMatch) => {
      if (error) return res.status(401).send({ error });

      if (isMatch) {
        const accessToken = JWT.sign(
          { userID: user._id, email: user.email },
          process.env.ACCESS_TOKEN,
          { expiresIn: process.env.ACCESS_TOKEN_LIFESPAN }
        );

        const refreshToken = JWT.sign(
          { userID: user._id },
          process.env.REFRESH_TOKEN,
          { expiresIn: process.env.REFRESH_TOKEN_LIFESPAN }
        );

        try {
          await user.updateOne({ refreshToken: refreshToken });
          const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
          const userAgent = req.headers["user-agent"];
          handleLogs(
            `[LOGIN-SUCCESS] User: ${email} | Time: ${new Date().toISOString()} | IP: ${ip} | UA: ${userAgent}`
          );
        } catch (error) {
          res.status(500).json({ message: error.message });
        }

        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
          maxAge: process.env.COOKIE_MAX_AGE,
        });

        res.json({ accessToken });
      } else {
        handleLogs(
          `[LOGIN-FAIL] Wrong password for: ${email} | Time: ${new Date().toISOString()}`
        );
        return res.status(401).json({
          message:
            "Your password is incorrect or this account doesn't exist. Please check and try again",
        });
      }
    });
  } else {
    handleLogs(
      `[LOGIN-FAIL] Unknown user: ${email} | Time: ${new Date().toISOString()}`
    );
    return res.status(401).send({ message: "The account doesn't exist" });
  }
}

export default handleAuth;
