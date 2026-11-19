const jwt = require("jsonwebtoken");

const audience = "moviebag-session";
const issuer = "moviebag";
const objectIdPattern = /^[a-f0-9]{24}$/i;

const signSession = (user) =>
  jwt.sign(
    { version: user.sessionVersion ?? 0 },
    process.env.TOKEN_KEY,
    {
      algorithm: "HS256",
      audience,
      issuer,
      subject: String(user._id),
      expiresIn: process.env.TOKEN_EXPIRES_IN || "1d",
    },
  );

const verifySession = (token) => {
  const claims = jwt.verify(token, process.env.TOKEN_KEY, {
    algorithms: ["HS256"],
    audience,
    issuer,
  });
  if (
    typeof claims.sub !== "string" ||
    !objectIdPattern.test(claims.sub) ||
    !Number.isSafeInteger(claims.version) ||
    claims.version < 0 ||
    !Number.isSafeInteger(claims.exp)
  ) {
    throw new jwt.JsonWebTokenError("Invalid session claims");
  }
  return claims;
};

module.exports = { signSession, verifySession };
