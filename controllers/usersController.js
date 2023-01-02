const { insertNewUser, verifyNewuser } = require("../models/usersModel");

function createNewUser(req, res, next) {
  const { email, password, role } = req.body;

  insertNewUser(email, password, role)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => {
      next(err);
    });
}
function verifyUser(req, res, next) {
  const { token } = req.params;
  const { email } = req.body;

  verifyNewuser(email, token)
    .then(() => {
      res.status(200).send("Email verified! Please proceed to login");
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { createNewUser, verifyUser };
