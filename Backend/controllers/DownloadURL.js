const DownloadURL = require("../models/DownloadUrl");
const sequelize = require("../utils/db");
const DownloadController = {
  getDownloadLink: async (req, res) => {
    try {
      const dbResult = await DownloadURL.findAll({
        where: { email: req.user.email },

      });
      res.send(dbResult);
    } catch (error) {
      console.log(error.message);
      res.status(404).send(error.message);
    }
  },
};
module.exports = { DownloadController };
