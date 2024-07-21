const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const user = jwt.verify(token, "secretRandomKey");
    User.findByPk(user.userId).then((user) => {
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
  }
};
module.exports = { authenticate };
