const jwt = require("jsonwebtoken");
const config = require("../auth/config");
const logger = require("../logs/logger");
const db = require("../models");
const { ROLES } = require("../utils/const");

verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

  jwt.verify(token, config.secret, (err, decodedString) => {
    if (err) {
      logger.error(err);
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.role = decodedString.user.role;
    next();
  });
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
  verifyToken,
  isAdmin,
};

module.exports = authorization;
