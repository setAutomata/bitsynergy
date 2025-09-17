import JWT from "jsonwebtoken";
import User from "../model/User.js";

async function handleRefreshToken(req, res) {
  const refreshToken = req.cookies?.jwt;

  try {
    const user = await User.findOne({ refreshToken: refreshToken });
    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: "Invalid token" });

    JWT.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError")
          return res.status(403).json({ message: "Refresh token expired" });
        else return res.status(403).json({ message: "Invalid refresh token" });
      }
    });

    const accessToken = JWT.sign(
      { userID: user._id, email: user.email },
      process.env.ACCESS_TOKEN,
      { expiresIn: process.env.ACCESS_TOKEN_LIFESPAN }
    );

    const newRefreshToken = JWT.sign(
      { userID: user._id },
      process.env.REFRESH_TOKEN,
      { expiresIn: process.env.REFRESH_TOKEN_LIFESPAN }
    );

    try {
      await user.updateOne({ refreshToken: newRefreshToken });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: process.env.COOKIE_MAX_AGE,
    });

    res.send({ accessToken });
  } catch {
    return res.status(403).json({ message: "Token verification failed" });
  }
}

export default handleRefreshToken;
