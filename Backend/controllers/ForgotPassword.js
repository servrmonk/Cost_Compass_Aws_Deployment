require("dotenv").config();

const FgtPwd = require("../models/ForgotPasswordRequestsModel");
const User = require("../models/UserModel");

const bcrypt = require("bcrypt");

const ForgotPassword = {
  forgetPassword: async (req, res) => {
    // console.log("Inside forget forget password");

    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email: email },
    });
    const userId = user.dataValues.id;

    try {
      if (user) {
        // Extracting userid and create a new request for forget password

        const newRequest = await FgtPwd.create({ isActive: true, userId });

        const requestId = newRequest.dataValues.id;

        // Include the Brevo library
        const Sib = require("sib-api-v3-sdk"); // imported Brevo
        const client = Sib.ApiClient.instance;

        // Instantiate the client
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.SENTITBLUE_BREVO_EXPENSE_TRACKER_API_KEY;

        // Create a transactional email API instance
        const transEmailApi = new Sib.TransactionalEmailsApi();

        // Define the campaign settings
        const sender = {
          email: "",
          name: "",
        };

        const receivers = [
          // it will be the array of objects
          {
            email: "",
          },
        ];

        // Send the transactional email using async/await
        const data = await transEmailApi.sendTransacEmail({
          sender,
          to: receivers,
          subject: "Reset Link for forgot password",
          htmlContent: `<a href= http://localhost:5173/forgetPassword/${requestId}>Update Password</a>`,
        });

        return res.status(201).json({
          success: true,
          message: "Password reset successfull",
          data: newRequest,
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "No such user found",
        });
      }
    } catch (err) {
      console.log("Error in sendTransacEmail", err);
      return res.status(400).json({
        success: false,
        message: "Something error in password reseting ",
        error: err,
      });
    }
    // if you don't want your mail to go to promotions, add some real content there
  },
  checkIfRequestExist: async (req, res) => {
    const { requestId } = req.params;

    try {
      const request = await FgtPwd.findByPk(requestId);

      if (request) {
        res.status(201).json({
          success: true,
          message: "User request id exist",
          data: request,
          isActive: request.isActive,
        });
      }
    } catch (err) {
      res
        .status(500)
        .json({ msg: "Failed to find requestid of  user", err: err });
    }
  },
  updatePassword: async (req, res) => {
    const { email, password } = req.body;
    const { requestId } = req.params;

    try {
      if (!email || !password) {
        res.status(404).json({ err: "Email or password is not found " });
      }

      const userEmail = await User.findOne({ where: { email: email } });
      const reqId = await FgtPwd.findByPk(requestId);

      if (!userEmail) {
        res.status(404).json({ err: "User doesn't exist in the db " });
      }

      if (!reqId) {
        res.status(404).json({
          err: "User can't update the password ,request id don't exist in the db",
        });
      }
      // console.log("UserEmail in db is ", userEmail.email);
      // console.log("reqestId in db is ", reqId);

      bcrypt.hash(password, 10, async (err, hash) => {
        // console.log("Error in bcrypt.hash ", err);
        // console.log("Hash in update password ", hash);
        const updPwd = await User.update(
          { password: hash },
          { where: { email: userEmail.email } }
        );

        const isActiveUpd = await FgtPwd.update(
          { isActive: false },
          { where: { id: requestId } }
        );

        res.status(201).json({
          success: true,
          message: "Password updated succesfully",
        });
      });
    } catch (err) {
      console.log("Error in Update password ", err);
      res.status(500).json({ err: "Failed to Update password" });
    }
  },
};
module.exports = ForgotPassword;
