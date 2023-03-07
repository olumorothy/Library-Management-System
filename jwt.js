const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const logger = require("./logs/logger");
const { ERROR_MSG } = require("./utils/const");

const privateKey = fs.readFileSync(
  path.join(__dirname, "keys", "rsa.key"),
  "utf8"
);
const publicKey = fs.readFileSync(
  path.join(__dirname, "keys", "rsa.key.pub"),
  "utf8"
);

module.exports = {
  signToken: (payload) => {
    try {
      return jwt.sign(payload, privateKey, { algorithm: "RS256" });
    } catch (err) {
      logger.error(ERROR_MSG, err);
      throw err;
    }
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, publicKey, { algorithm: "RS256" });
    } catch (err) {
      logger.error(ERROR_MSG, err);
      throw err;
    }
  },
};
