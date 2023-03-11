const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Borrowing = sequelize.define("borrowings", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    returned_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return Borrowing;
};
