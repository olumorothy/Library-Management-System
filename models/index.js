const dbConfig = require("../db/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("../models/users.model.js")(sequelize, Sequelize);
db.books = require("../models/books.model.js")(sequelize, Sequelize);
db.borrowings = require("../models/borrowing.model.js")(sequelize, Sequelize);

db.users.hasMany(db.borrowings, { as: "borrowings" });
db.books.hasMany(db.borrowings, { as: "borrowings" });

db.borrowings.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});
db.borrowings.belongsTo(db.books, { foreignKey: "bookId", as: "book" });

module.exports = db;
