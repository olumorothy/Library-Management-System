const db = require("../models");
const logger = require("../logs/logger");
const User = db.users;
const bcrypt = require("bcrypt");
const saltRounds = 12;
const { ERROR_MSG } = require("../utils/const");
const addNewUser = require("../services/users.services");
const redisClient = require("../middlewares/redis");

function createNewUser(req, res, next) {
  const { email, password, role, firstname, lastname, gender, dob } = req.body;

  addNewUser(email, password, role, firstname, lastname, gender, dob)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => {
      logger.error(ERROR_MSG, err);
      next(err);
    });
}
async function verifyUser(req, res, next) {
  const { email, token } = req.body;

  const OTP = await redisClient.get(`${email}_verify_registration_otp`);

  if (OTP) {
    const userFound = await User.findOne({ where: { email: email } });
    bcrypt.compare(OTP, token).then((isMatch) => {
      if (isMatch) {
        if (userFound.isVerified) {
          res
            .status(403)
            .json({ message: "User Already Verified. Please Login" });
        } else {
          if (OTP === token) {
            User.update(
              {
                isVerified: true,
              },
              {
                where: {
                  email: userFound.email,
                },
              }
            )
              .then((row) => {
                res
                  .status(200)
                  .json({ message: "Email verified! Please proceed to login" });
              })
              .catch((err) => {
                logger.error(ERROR_MSG, err);
                next(err);
              });
          }
        }
      } else {
        res
          .status(401)
          .json({ message: "Incorrect OTP, account not verified" });
      }
    });
  } else {
    res.status(400).json({ message: "OTP not found" });
  }
}

function adminPage(req, res, next) {
  return res.status(200).send("Admin Content");
}

module.exports = { createNewUser, verifyUser, adminPage };
