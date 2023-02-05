const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Book = sequelize.define("books", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    nosAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  });
  return Book;
};
