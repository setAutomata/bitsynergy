import fs from "node:fs";
import { fileURLToPath } from "url";
import path from "node:path";
import User from "../model/User.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFilePath = path.join(__dirname, "../logs/user-update.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

function handleLogs(message) {
  console.log(message);
  logStream.write(message + "\n");
}

const updatePwd = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const { email, password } = req.body;

  if (!email || !password) {
    handleLogs(
      `[UPDATE-FAIL] No email and password recieved for: IP: ${ip} | Time: ${new Date().toISOString()} | UA: ${userAgent}`
    );
    return res.status(400).json({ message: "Email & password is required" });
  }

  const user = await User.findOne({ email: email });

  if (user) {
    try {
      user.password = password;
      await user.save();
      handleLogs(
        `[UPDATE-SUCCESSFUL] Password changed for: ${email} | IP: ${ip} | Time: ${new Date().toISOString()} | UA: ${userAgent}`
      );
      res.status(204).json({ message: "Password updated successfully" });
    } catch (error) {
      handleLogs(
        `[UPDATE-FAIL] Password update to db failed for: ${email} | IP: ${ip} | Time: ${new Date().toISOString()} | UA: ${userAgent}`
      );
      return res.status(500).json({ message: error.message });
    }
  } else {
    handleLogs(
      `[UPDATE-FAIL] Email not found in the db for: ${email} | IP: ${ip} | Time: ${new Date().toISOString()} | UA: ${userAgent}`
    );
    return res.status(401).json({ message: "Email is not in the database" });
  }
};

export default updatePwd;
