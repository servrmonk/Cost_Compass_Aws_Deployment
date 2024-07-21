const Expense = require("../models/ExpenseModel");
const User = require("../models/UserModel");

const sequelize = require("../utils/db"); //using transaction
const DownloadUrl = require("../models/DownloadUrl");

const S3Services = require("../services/S3services");

const ExpenseController = {
  getAvailableExpense: async (req, res) => {
    const user_id = req.user.id;

    try {
      const availExpense = await Expense.findAll({
        where: { user_id: user_id },
      });
      res.json(availExpense);
    } catch (error) {
      console.log("Error in getting expense", error);
      res.status(500).json({ error: "Failed to fetch expense" });
    }
  },

  // Get Expense By Pagination
  getExpenseForPagination: async (req, res) => {
    const user_id = req.user.id;
    const { rowsperpage, page } = req.query;
    const startIndex = (page - 1) * rowsperpage;

    try {
      // Get all expenses for the user
      const availExpense = await Expense.findAll({
        where: { user_id: user_id },
      });

      // Paginate the expenses
      const slicedExpense = availExpense.slice(
        startIndex,
        startIndex + Number(rowsperpage)
      );

      // Get the total count of expenses
      const totalCount = availExpense.length;

      res.status(200).json({ expenses: slicedExpense, totalCount });
    } catch (error) {
      console.log("Error in getting expense", error);
      res.status(500).json({ error: "Failed to fetch expense" });
    }
  },

  /* Creating the  Expense in mysql2 */
  createExpense: async (req, res) => {
    const user_id = req.user.id;
    let data = {
      user_id: user_id,
      totalExpense: req.body.totalExpense,
      expenseamount: req.body.expenseamount,
      category: req.body.category,
      date: req.body.date,
      description: req.body.description,
    };

    const trans = await sequelize.transaction();

    try {
      const newExpense = await Expense.create(data, { transaction: trans });
      const user = await User.findByPk(user_id);
      if (!user) {
        await trans.rollback(); // rollback if user is not present
        console.log("Transaction rollback happens");
        return res.status(404).json({ error: "User not found" });
      }
      const totalExpense =
        Number(user.totalExpense || 0) + Number(req.body.expenseamount);

      const updatedTotalAmount = await user.update(
        {
          totalExpense: totalExpense,
        },
        { transaction: trans }
      );
      await trans.commit(); // if everything is okay, commit the transaction
      res.status(201).json(newExpense);
    } catch (error) {
      await trans.rollback(); // in case if there is any issues, it will roll back
      console.log("Error in creating expense", error);
      res.status(500).json({ error: "Failed to create expense" });
    }
  },

  /* Updating all the available Expense From mysql2 */
  updateExpense: async (req, res) => {
    const { id } = req.params;
    const { expenseamount, category, date, description } = req.body;

    try {
      const expenseToUpdate = await Expense.findByPk(id);
      if (!expenseToUpdate) {
        return res.status(404).json({ error: "Expense not found" });
      }

      // Update the fields
      expenseToUpdate.expenseamount = expenseamount;
      expenseToUpdate.category = category;
      expenseToUpdate.date = date;
      expenseToUpdate.description = description;

      await expenseToUpdate.save();

      res.json(expenseToUpdate);
    } catch (error) {
      console.log("Error in updating expense", error);
      res.status(500).json({ error: "Failed to update expense" });
    }
  },

  /* Deleting all the available Expense From mysql2 */
  deleteExpense: async (req, res) => {
    const { id } = req.params;
    console.log("id in delete expense ", id);

    const user = req.user;
    const findedExpenses = await Expense.findOne({ where: { id: id } });
    try {
      if (!findedExpenses) {
        return res.status(404).json({ error: "Slot not found" });
      }

      const findTotalExpense = user.totalExpense;
      const findCurrentExpense = findedExpenses.expenseamount;
      await findedExpenses.destroy();

      await user.update({
        totalExpense: findTotalExpense - findCurrentExpense,
      });
      res.status(200).json({ message: "Slot deleted successfully" });
    } catch (error) {
      console.log("Error in deleting slot", error);
      res.status(500).json({ error: "Failed to delete slot" });
    }
  },

  downloadExpense: async (req, res) => {
    try {
      const { name, email, totalExpense, id } = req.user;

      const dbRes = await Expense.findAll({
        where: { user_id: id },
      });

      const stringifiedExpenses = JSON.stringify(dbRes);
      const userId = id;
      const filename = `Expense${userId}/${new Date()}.txt`;

      const fileUrl = await S3Services.uploadToS3(
        stringifiedExpenses,
        filename
      );
      // console.log("Fileurl is ", fileUrl);
      const downloadRes = await DownloadUrl.create({
        url: fileUrl,
        email: email,
        userId: id,
      });
      res.status(200).json({ fileUrl, success: true });
    } catch (err) {
      console.log("Error in download expense ", err);
      res.status(500).json({ fileUrl: "", success: false, err: err });
    }
  },
};

module.exports = ExpenseController;
