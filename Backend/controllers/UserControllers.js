const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

/* To generate jwt token for userId */
function generateAccessToken(id) {
  return jwt.sign({ userId: id }, "secretRandomKey");
}

const UserControllers = {
  /* Creating the user  */
  createUser: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const userEmail = await User.findOne({ where: { email: email } });
      if (userEmail === null) {
        bcrypt.hash(password, 10, async (err, hash) => {
          console.log("Error in bcrypt.hash ", err);
          // console.log("Hash======> ", hash);
          const newUser = await User.create({
            name,
            email,
            password: hash,
            premium: false,
          });
          // console.log("Newuser ",newUser.dataValues.id);
          // console.log("New User in usercontroller ", newUser);
          res.status(201).json({
            success: true,
            message: "User created in succesfully",
            token: generateAccessToken(newUser.dataValues.id),
          });
        });
      } else {
        console.log("User already exist ");
        res.status(401).json({ err: "User already exist" });
      }
    } catch (err) {
      console.log("Error in Creating user ", err);
      res.status(500).json({ err: "Failed to create user" });
    }
  },

  /* Checking if the user exist or not if exist then login the user  */

  loginUser: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const user = await User.findAll({
        where: { email: email },
      });
      // console.log(req.body);
      if (user.length > 0) {
        // console.log("yes user present ", user);
        bcrypt.compare(password, user[0].password, (err, result) => {
          if (err) {
            res
              .status(500)
              .json({ success: false, message: "Something went wrong" });
          } else if (result) {
            res.status(200).json({
              success: true,
              message: "User logged in succesfully",
              token: generateAccessToken(user[0].id),
              premium: user[0].premium,
            });
          } else {
            return res
              .status(400)
              .json({ success: false, message: "Password is incorrect" });
          }
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User Doesn't Exist" });
      }
    } catch (err) {
      res.status(500).json({ message: err, success: false });
    }
  },
};
module.exports = UserControllers;
