const LocalStrategy = require("passport-local");
const logger = require("../logs/logger");
const db = require("../models");

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
            if (user.password !== password) {
              return done(null, false, { message: "Wrong Password" });
            }
            return done(null, user, { message: "Logged in Successfully!" });
          })
          .catch((err) => {
            logger.error("An error has occured ", err);
            return done(err, false);
          });
      }
    )
  );
};
