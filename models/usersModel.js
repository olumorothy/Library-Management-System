const db = require("../db/connection");

function insertNewUser(email, password, role) {
  const token = "12345";
  return db
    .query(
      `INSERT INTO users(email,password,role,isVerified,token)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING email,password,isVerified,role,token;`,
      [email, password, role, "false", token]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function verifyNewuser(email, token) {
  return db
    .query(`SELECT * FROM users WHERE email =$1`, [email])
    .then(({ rows }) => {
      console.log(rows[0].isVerified);
      if (rows.length === 0) {
        //email is not found
        return Promise.reject({
          status: 400,
          msg: "Email is invalid. Please check that you've registered with the correct email",
        });
      } else {
        if (rows[0].token !== token) {
          return Promise.reject({
            status: 400,
            msg: "Token is invalid",
          });
        }
        //account already verified
        if (rows[0].isVerified) {
          return Promise.reject({
            status: 400,
            msg: "Account already verified",
          });
        }
        return db
          .query(
            `UPDATE users SET isVerified = $2
          WHERE email = $1 RETURNING *`,
            [email, true]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      }
    });
}

module.exports = { insertNewUser, verifyNewuser };
