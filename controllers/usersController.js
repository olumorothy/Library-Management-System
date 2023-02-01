const db = require("../models");
const logger = require("../logs/logger");
const User = db.users;
const bcrypt = require("bcrypt");
const saltRounds = 12;
const { ERROR_MSG } = require("../utils/const");

function createNewUser(req, res, next) {
  const { email, password, role, firstname, lastname, gender, dob } = req.body;

  bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      let password = hash;
      User.create({
        email,
        password,
        role,
        firstname,
        lastname,
        gender,
        dob,
      })
        .then((data) => {
          res.status(201).send({ data });
        })
        .catch((err) => {
          logger.error(ERROR_MSG, err);
          next(err);
        });
    })
    .catch((err) => {
      logger.error("Unable to hash password", err);
      next(err);
    });
}
function verifyUser(req, res, next) {
  const { token } = req.params;
  const { email } = req.body;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (user) {
        if (user.isVerified) {
          res.status(400).send({
            message: "Account already verified!",
          });
        } else if (token !== "12345") {
          res.status(400).send({
            message: "Token is invalid",
          });
        } else {
          User.update(
            {
              isVerified: true,
            },
            {
              where: {
                email: user.email,
              },
            }
          )
            .then((row) => {
              res.status(200).send("Email verified! Please proceed to login");
            })
            .catch((err) => {
              logger.error(ERROR_MSG, err);
              next(err);
            });
        }
      } else {
        res.status(404).send({
          message:
            "Email not found. Please check that you've registered with the correct email",
        });
      }
    })
    .catch((err) => {
      logger.error(ERROR_MSG, err);
      next(err);
    });
}

function adminPage(req, res, next) {
  return res.status(200).send("Admin Content");
}

module.exports = { createNewUser, verifyUser, adminPage };
