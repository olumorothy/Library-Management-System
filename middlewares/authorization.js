const { verifyToken } = require("../jwt");
const logger = require("../logs/logger");

const { ROLES } = require("../utils/const");

tokenVerification = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    logger.error("No token provided");
    return res.status(403).send({ message: "No token provided" });
  }

  const verified = verifyToken(token);

  if (!verified.user) {
    return res.status(401).send({ message: "Unauthorized!" });
  }

  req.role = verified.user.role;
  req.username = verified.user.fullname;
  next();
};

isAdmin = (req, res, next) => {
  if (req.role === ROLES.Admin) {
    next();
    return;
  } else {
    return res.status(403).send({ message: "Required Admin Role!" });
  }
};

const authorization = {
  tokenVerification,
  isAdmin,
};

module.exports = authorization;
