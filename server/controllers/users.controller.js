import fs from "node:fs";
import { fileURLToPath } from "url";
import path from "node:path";
import User from "../model/User.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFilePath = path.join(__dirname, "../logs/users.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

function handleLogs(message) {
  console.log(message);
  logStream.write(message + "\n");
}

const checkUser = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const { email } = req.body;

  if (!email) {
    handleLogs(
      `[USERS-FAIL] No email address recievied for: ${email} | IP: ${ip} | Time: ${new Date().toISOString()} | UA: ${userAgent}`
    );
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email: email });

  if (user) {
    try {
      handleLogs(
        `[USERS-SUCCESS] Found email in the db for: ${email} | IP: ${ip} | Time: ${new Date().toISOString()} | UA: ${userAgent}`
      );
      res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    handleLogs(
      `[USERS-FAIL] Can't find email in the db for: ${email} | IP: ${ip} | Time: ${new Date().toISOString()} | UA: ${userAgent}`
    );
    return res.status(401).json({ message: "Email not found." });
  }
};

export default checkUser;
