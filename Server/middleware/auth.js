const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).send({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
