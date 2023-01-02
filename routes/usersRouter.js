const { createNewUser, verifyUser } = require("../controllers/usersController");

const userRouter = require("express").Router();
const validation = require("../validators/validation");
const { validate } = require("../validators/validationMiddleware");

//creates a new user with the endpoint api/users/signup
userRouter.post("/signup", validate(validation.signUpSchema), createNewUser);

// endpoint api/users/verify/:token
userRouter.post(
  "/verify/:token",
  validate(validation.verifySchema),
  verifyUser
);

module.exports = userRouter;
