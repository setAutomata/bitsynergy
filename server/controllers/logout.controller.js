import fs from "node:fs";
import { fileURLToPath } from "url";
import path from "node:path";
import User from "../model/User.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFilePath = path.join(__dirname, "../logs/user-logout.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

function handleLogs(message) {
  console.log(message);
  logStream.write(message + "\n");
}

async function handleLogout(req, res) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    handleLogs(
      `[LOGOUT-WARNING] No JWT cookies recieved for: IP: ${ip} | Time: ${new Date().toISOString()} | UA: ${userAgent}`
    );
    return res.sendStatus(204);
  }
  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken: refreshToken });

  if (user) {
    try {
      await user.updateOne({ refreshToken: "" });
      handleLogs(
        `[LOGOUT-SUCCESS] User: ${
          user.email
        } | Time: ${new Date().toISOString()} | IP: ${ip} | UA: ${userAgent}`
      );
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: new Date(0),
      });
      res.sendStatus(204);
    } catch (error) {
      handleLogs(
        `[LOGOUT-FAIL] Failed to clear refresh token for: ${
          user.email
        } | Time: ${new Date().toISOString()} | IP: ${ip} | UA: ${userAgent}`
      );
      res.status(500).json({ message: error.message });
    }
  } else {
    handleLogs(
      `[LOGOUT-FAIL] No refresh address in the db for: IP: ${ip} | Time: ${new Date().toISOString()} | UA: ${userAgent}`
    );
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: new Date(0),
    });
    return res.status(204);
  }
}

export default handleLogout;
