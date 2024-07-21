const sequelize = require("../utils/db");

const { Sequelize, DataTypes } = require("sequelize");

const Expense = sequelize.define("expenses", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  expenseamount: Sequelize.INTEGER,
  category: Sequelize.STRING,
  date: Sequelize.DATEONLY,
  description: Sequelize.STRING,
});

module.exports = Expense;
