const db = require("../models");
const logger = require("../logs/logger");
const User = db.users;

const Op = db.Sequelize.Op;

function createNewUser(req, res, next) {
  const { email, password, role, firstname, lastname, gender, dob } = req.body;
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
      logger.error("An error has occured: ", err);
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
              logger.error("An error has occured: ", err);
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
      logger.error("An error has occured: ", err);
      next(err);
    });
}

module.exports = { createNewUser, verifyUser };
