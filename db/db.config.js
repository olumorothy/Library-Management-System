require("dotenv").config();

module.exports = {
  HOST: process.env.HOST,
  USER: process.env.USERNAME,
  PASSWORD: process.env.PASSWORD,
  DB: process.env.DB,
  dialect: process.env.DIALECT,
};
