const sequelize = require("../utils/db");

const { Sequelize, DataTypes } = require("sequelize");

const user = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  premium:Sequelize.BOOLEAN,
  totalExpense:{
    type:Sequelize.INTEGER,defaultValue:0
  }
});

module.exports = user;
