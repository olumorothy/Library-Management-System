const LocalStrategy = require("passport-local");
const logger = require("../logs/logger");
const db = require("../models");
const bcrypt = require("bcrypt");
const { ERROR_MSG } = require("../utils/const");

const User = db.users;

module.exports = (passport) => {
  passport.use(
    "local-login",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      (email, password, done) => {
        User.findOne({ where: { email: email } })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "User not found" });
            }

            bcrypt.compare(password, user.password).then((isMatch) => {
              if (isMatch) {
                return done(null, user, { message: "Logged in Successfully!" });
              } else {
                return done(null, false, { message: "Wrong Password" });
              }
            });
          })
          .catch((err) => {
            logger.error(ERROR_MSG, err);
            return done(err, false);
          });
      }
    )
  );
};
