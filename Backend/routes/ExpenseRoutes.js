const express = require("express");
const router = express.Router();

const userAuthenticate = require("./Auth");

const {
  createExpense,
  deleteExpense,
  getAvailableExpense,
  updateExpense,
  getExpenseForPagination,
} = require("../controllers/ExpenseControllers");

router.post("/createExpense", userAuthenticate.authenticate, createExpense);

router.get(
  "/getExpenseById",
  userAuthenticate.authenticate,
  getAvailableExpense
);
router.get(
  "/getExpenseForPagination",
  userAuthenticate.authenticate,
  getExpenseForPagination
);

router.put("/updateExpense/:id", userAuthenticate.authenticate, updateExpense);
router.delete(
  "/deleteExpense/:id",
  userAuthenticate.authenticate,
  deleteExpense
);

module.exports = router;
