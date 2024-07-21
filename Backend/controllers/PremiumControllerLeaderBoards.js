const User = require("../models/UserModel");
const Expense = require("../models/ExpenseModel");
const sequelize = require("../utils/db");

const PremiumLeaderBoard = async (req, res) => {
  try {
    const leaderboardOfUsers = await User.findAll({
      order: [["totalExpense", "DESC"]],
    });

    res.status(200).json(leaderboardOfUsers);
  } catch (err) {
    console.log("Error in premiumLeaderBoard: ", err);
    res.status(500).json(err);
  }
};

module.exports = { PremiumLeaderBoard };
