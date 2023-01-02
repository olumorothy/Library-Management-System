const { Pool } = require("pg");

const config = {
  host: "localhost",
  user: "admin",
  password: "",
  database: "lms",
};

module.exports = new Pool(config);
