const users = require("../controllers/usersController");
const passport = require("passport");
require("../auth/auth.config")(passport);
const jwt = require("jsonwebtoken");
const userRouter = require("express").Router();
const validation = require("../validators/validation");
const { validate } = require("../validators/validationMiddleware");
const logger = require("../logs/logger");
const { ERROR_MSG } = require("../utils/const");
const config = require("../auth/config");

userRouter.post(
  "/signup",
  validate(validation.signUpSchema),
  users.createNewUser
);

userRouter.post(
  "/verify/:token",
  validate(validation.verifySchema),
  users.verifyUser
);

userRouter.post(
  "/login",
  validate(validation.loginSchema),
  function (req, res, next) {
    passport.authenticate("local-login", function (err, user, info) {
      if (err) {
        logger.error(ERROR_MSG, err);
        return next(err);
      }
      if (!user) {
        return res
          .status(401)
          .send({ msg: "Authentication failed!, wrong email or password " });
      }
      req.login(user, { session: false }, (err) => {
        if (err) {
          logger.error(ERROR_MSG, err);
          return next(err);
        }

        const body = {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
        };
        const token = jwt.sign({ user: body }, config.secret);
        return res.status(202).send({
          token: token,
          status: "Logged in successfully",
          user: req.user,
        });
      });
    })(req, res, next);
  }
);

module.exports = userRouter;
