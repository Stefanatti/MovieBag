const User = require("../modules/userModule");
const { verifySession } = require("../utils/sessionToken");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  let claims;
  try {
    claims = verifySession(token);
  } catch (err) {
    return res.status(401).send({ message: "Invalid or expired token." });
  }

  try {
    const user = await User.findById(claims.sub, "username sessionVersion");
    if (!user || (user.sessionVersion ?? 0) !== claims.version) {
      return res.status(401).send({ message: "Invalid or expired token." });
    }
    req.user = { id: claims.sub, username: user.username };
  } catch (err) {
    console.error("Could not verify session:", err.name);
    return res.status(500).send({ message: "Could not verify session." });
  }
  return next();
};

module.exports = authMiddleware;
