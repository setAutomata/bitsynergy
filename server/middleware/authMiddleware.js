import JWT from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const accessToken = authHeader.split(" ")[1];

  JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = payload.userID;
    next();
  });
};

export default verifyJWT;
