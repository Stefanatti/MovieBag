const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).send({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
