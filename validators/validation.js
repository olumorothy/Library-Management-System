const Joi = require("joi");
const pattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
exports.signUpSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().pattern(new RegExp(pattern)).required(),
  role: Joi.string().valid("admin", "student").required(),
  firstname: Joi.string().min(2).required(),
  lastname: Joi.string().min(2).required(),
  gender: Joi.string().valid("male", "female").required(),
  dob: Joi.date().less("1-12-2022"),
});

exports.verifySchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).required(),
});
