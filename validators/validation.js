const Joi = require("joi");

exports.signUpSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(4).max(15).required().label("Password"),
  role: Joi.string().required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm Password")
    .messages({ "any.only": "{{#label}} does not match password" }),
});

exports.verifySchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});
