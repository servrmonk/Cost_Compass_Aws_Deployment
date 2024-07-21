const express = require("express");
const router = express.Router();
const {
  forgetPassword,
  checkIfRequestExist,
  updatePassword,
} = require("../controllers/ForgotPassword");
// const userAuthenticate = require("./Auth");

/* Available routes for forgotpassword */

router.post("/forgotPassword", forgetPassword);
router.get("/resetPasswordRequestExist/:requestId", checkIfRequestExist);

//update the old password and activeStatus

router.put("/updatePassword/:requestId", updatePassword);

module.exports = router;
