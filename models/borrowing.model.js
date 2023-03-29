const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Borrowing = sequelize.define("borrowings", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    lastUpdatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    returned_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isReturned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return Borrowing;
};
