const Joi = require("joi");
const pattern = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~][0-9]/;
exports.signUpSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().pattern(new RegExp(pattern)).min(3).max(15).required(),
  role: Joi.any().allow("admin", "student").required(),
  firstname: Joi.string().min(2).required(),
  lastname: Joi.string().min(2).required(),
  gender: Joi.any().allow("male", "female", "M", "f").required(),
  dob: Joi.date().less("1-12-2022"),
});

exports.verifySchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});
