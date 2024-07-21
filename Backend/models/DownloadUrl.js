const { INTEGER, STRING } = require("sequelize");
const sequelize = require("../utils/db");

const DownloadURL = sequelize.define("downloadurl", {
  id: { autoIncrement: true, allowNull: true, type: INTEGER, primaryKey: true },
  url: { type: STRING, allowNull: false },
  email: {
    allowNull: false,
    type: STRING,
    allowNull: false,
  },
});

module.exports = DownloadURL;
