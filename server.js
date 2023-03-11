const express = require("express");
const cors = require("cors");
const passport = require("passport");
const liquibase = require("liquibase").Liquibase;

const app = express();
app.use(cors());

app.use(express.json());

const apiRouter = require("./routes/api-router");

app.use("/api", apiRouter);

app.use(passport.initialize());

const db = require("./models");

const liquibaseConfig = require("./resources/liquibase/config");
const liquibaseConnection = new liquibase(liquibaseConfig);

liquibaseConnection.status();

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log("Unable to connect to the database: ", err.message);
  });

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Page does not exist" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ message: err.msg });
  } else {
    next(err);
  }
});
app.use((err, req, res, next) => {
  if (err.parent.code === "23505") {
    res.status(400).send({ message: "Email already exists." });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error" });
});

module.exports = app;
