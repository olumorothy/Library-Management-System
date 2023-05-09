const db = require("../models");
const User = db.users;
const bcrypt = require("bcrypt");
const saltRounds = 12;
const nanoid = require("nanoid");
const logger = require("../logs/logger");
const { ERROR_MSG } = require("../utils/const");
const producer = require("./messaging/producer");
const redisClient = require("../middlewares/redis");

function addNewUser(email, password, role, firstname, lastname, gender, dob) {
  console.log("inside service");
  return bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      let password = hash;
      return User.create({
        email,
        password,
        role,
        firstname,
        lastname,
        gender,
        dob,
      })
        .then(async (data) => {
          const OTP = nanoid.customAlphabet("1234567890", 6)();

          const messageContent = {
            email,
            firstname,
            OTP,
            messageType: "userSignup",
          };
          await redisClient.set("otp", OTP, { EX: 600, NX: true });
          await producer.produce(messageContent);
          return data;
        })
        .catch((err) => {
          logger.error(ERROR_MSG, err);
          return Promise.reject({
            status: 500,
            msg: "Unable to complete request at this time",
          });
        });
    })
    .catch((err) => {
      logger.error("Unable to hash password", err);
      return Promise.reject({
        status: 500,
        msg: "Unable to complete request at this time",
      });
    });
}

module.exports = addNewUser;
