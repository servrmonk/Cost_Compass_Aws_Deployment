const express = require("express");
const router = express.Router();

const userAuthenticate = require("./Auth");
const {
  PremiumLeaderBoard,
} = require("../controllers/PremiumControllerLeaderBoards");
const { downloadExpense } = require("../controllers/ExpenseControllers");
const { DownloadController } = require("../controllers/DownloadURL");

router.get("/showLeaderBoard", PremiumLeaderBoard);
router.get("/downloadExpense", userAuthenticate.authenticate, downloadExpense);
router.get(
  "/downloadExpenseDetails",
  userAuthenticate.authenticate,
  DownloadController.getDownloadLink
);

module.exports = router;
