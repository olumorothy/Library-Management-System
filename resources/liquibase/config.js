require("dotenv").config();
const POSTGRESQL_DEFAULT_CONFIG =
  require("liquibase").POSTGRESQL_DEFAULT_CONFIG;

const myConfig = {
  ...POSTGRESQL_DEFAULT_CONFIG,
  changeLogFile: process.env.CHANGELOGFILE,
  url: process.env.URL,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

module.exports = myConfig;
