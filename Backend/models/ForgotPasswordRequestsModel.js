const sequelize = require("../utils/db");

const { Sequelize, DataTypes } = require("sequelize");

const ForgotPassword = sequelize.define("forgotPasswordRequest", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
});

module.exports = ForgotPassword;
