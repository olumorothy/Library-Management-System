const express = require("express");
const app = express();

app.use(express.json());

const apiRouter = require("./routes/api-router");

//load API routes
app.use("/api", apiRouter);

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
  res.status(500).send({ message: "Server Error" });
});

module.exports = app;
