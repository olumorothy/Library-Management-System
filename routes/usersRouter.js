const users = require("../controllers/usersController");

const userRouter = require("express").Router();
const validation = require("../validators/validation");
const { validate } = require("../validators/validationMiddleware");

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

module.exports = userRouter;
