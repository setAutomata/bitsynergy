import User from "../model/User.js";
import fs from "node:fs";
import { fileURLToPath } from "url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFilePath = path.join(__dirname, "../logs/user-register.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

function handleLogs(message) {
  console.log(message);
  logStream.write(message + "\n");
}

const register = async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const { email, password } = req.body;
  if (!email || !password) {
    handleLogs(
      `[REGISTRATION-FAIL] No email and password recieved from IP: ${ip} | Time: ${new Date().toISOString()} | UA: ${userAgent}`
    );
    return res.status(400).json({ message: "Email and Password are required" });
  }

  const isDuplicate = await User.findOne({ email: email });
  if (isDuplicate) {
    handleLogs(
      `[REGISTRATION-FAIL] email address conflict for: ${email} | Time: ${new Date().toISOString()} | IP: ${ip} | UA: ${userAgent}`
    );
    return res
      .status(409)
      .json({ message: "Email is already in the database" });
  }

  try {
    await User.create({
      email: email,
      password: password,
    });
    handleLogs(
      `[REGISTRATION-SUCCESS] user: ${email} | Time: ${new Date().toISOString()} | IP: ${ip} | UA: ${userAgent}`
    );
    res.status(201).json({
      message: `Successfuly added new user`,
    });
  } catch (error) {
    handleLogs(
      `[REGISTRATION-FAIL] Failed to enter email to db: ${email} | Time: ${new Date().toISOString()} | IP: ${ip} | UA: ${userAgent}`
    );
    res.status(500).json({ message: error.message });
  }
};

export default register;
