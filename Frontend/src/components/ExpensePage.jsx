import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../store/context";
import LeatherBoard from "./LeatherBoard";
import Pagination from "./Pagination"; // Import the Pagination component

export default function ExpensePage() {
  const {
    addExpense,
    editExpense,
    deleteExpense,
    userExpense,
    isPremiumUser,
    previousDownloadExpense,
    getExpenseAqPagination,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useContext(UserContext);
  // console.log("Current page => ", currentPage);
  // console.log("totalPage page => ", totalPages);
  const [leaderBoardToggle, setleaderBoardToggle] = useState(false);
  // console.log(leaderBoardToggle);

  const expenseAmount = useRef(null);
  const description = useRef(null);
  const category = useRef(null);
  const date = useRef(null);
  const [expenses, setExpenses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [editId, setEditId] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(
    Number(localStorage.getItem("itemsPerPage")) || 10
  );

  useEffect(() => {
    setExpenses([...userExpense]);
  }, [userExpense]);

  const deleteHandler = (item) => {
    deleteExpense(item.id);
    const filteredExpenses = expenses.filter((exp) => exp !== item);
    setExpenses(filteredExpenses);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const newExpense = {
      expenseamount: expenseAmount.current.value,
      category: category.current.value,
      description: description.current.value,
      date: date.current.value,
    };

    if (isEditing) {
      editExpense(editId, newExpense);
      setExpenses((prevExpenses) =>
        prevExpenses.map((exp) => (exp === currentExpense ? newExpense : exp))
      );
      setIsEditing(false);
      setCurrentExpense(null);
    } else {
      // console.log("New expense before going ", newExpense);
      addExpense(newExpense);
      setExpenses([...expenses, newExpense]);
    }
  };

  const editHandler = (expense) => {
    setEditId(expense.id);
    setIsEditing(true);
    setCurrentExpense(expense);
    expenseAmount.current.value = expense.expenseamount;
    description.current.value = expense.description;
    category.current.value = expense.category;
    date.current.value = expense.date;
  };

  const totalExpenses = expenses.reduce(
    (acc, exp) => acc + Number(exp.expenseamount),
    0
  );

  useEffect(() => {
    localStorage.setItem("itemsPerPage", itemsPerPage);
    getExpenseAqPagination(itemsPerPage, currentPage);
  }, [itemsPerPage, currentPage]);

  const handlePageChange = (page) => {
    // console.log("ON itemsPerPage in habdlepagecahang CHANGE ", itemsPerPage);
    // console.log("ON paGE CHANGE INHADNLE PAGE CHANGE ", page);
    setCurrentPage(page);
    // getExpenseAqPagination(10,page);
    getExpenseAqPagination(itemsPerPage, page);
    localStorage.setItem("itemsPerPage", itemsPerPage);
  };

  return (
    <>
      <div className="flex justify-between mt-10">
        {/* EXPENSE TRACKER FORM START */}
        <div className="shadow-2xl w-[30%] h-[310px] max-h-[500px] rounded-xl p-2 bg-neutral-100">
          <form action="submit" onSubmit={submitHandler}>
            <input
              className="mx-7 rounded-2xl hover:bg-transparent shadow-inner mt-3 bg-slate-200 p-2 text-xl font-serif w-[90%] "
              required
              placeholder="Enter Expense Amount"
              type="number"
              ref={expenseAmount}
            />
            <br />
            <input
              className="mx-7 rounded-2xl mt-3 mb-3 hover:bg-transparent shadow-inner bg-slate-200 p-2 text-xl font-serif w-[90%] "
              required
              type="text"
              placeholder="Description of Expense"
              ref={description}
            />
            <br />
            <div className="flex items-center mx-7 mb-3">
              <label className="mr-2 text-xl font-serif" htmlFor="category">
                Category:
              </label>
              <select
                className="rounded-xl hover:bg-transparent shadow-inner bg-slate-200 p-2 text-xl font-serif"
                ref={category}
                name="category"
                id="category"
                required
              >
                <option value="food">Food</option>
                <option value="petrol">Petrol</option>
                <option value="party">Party</option>
                <option value="others">Others</option>
              </select>
            </div>
            <input
              className="mx-7 rounded-2xl mt-3 hover:bg-transparent shadow-inner bg-slate-200 p-2 text-xl font-serif w-[90%] "
              required
              ref={date}
              type="date"
              placeholder="dd-mm-yyyy"
            />
            <br />
            <button
              type="submit"
              className="mt-3 ml-[35%] text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              {isEditing ? "Submit Edited Value" : "Add Expenses"}
            </button>
          </form>
        </div>

        {/* LEATHER BOARD */}
        {isPremiumUser &&
          (leaderBoardToggle ? (
            <LeatherBoard />
          ) : (
            <button
              type="button"
              onClick={() => setleaderBoardToggle((state) => !state)}
              className="text-white bg-gradient-to-br from-red-500 to-lime-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-lg px-2 py-2 text-center"
            >
              Show Premium Leaderboard
            </button>
          ))}

        {/* TOTAL EXPENSE PART START */}
        <div className="bg-neutral-100 hover:bg-slate-50 w-[25%] h-auto shadow-2xl rounded-xl p-4">
          <h1 className="text-2xl font-semibold hover:text-3xl hover:text-green-950 p-2 underline">
            Total Expenses
          </h1>
          <p className="w-[90%] h-9 rounded-xl p-1 text-center bg-gradient-to-r from-orange-300 via-gray-600 to-green-300 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 text-white font-semibold bg-green-400 m-auto text-xl hover:cursor-not-allowed">
            Rs: {totalExpenses}
          </p>
        </div>
      </div>

      {/* BOTTOM PART CURRENT EXPENSES */}
      {expenses.length > 0 && (
        <div className="max-h-fit h-fit bg-neutral-100 mt-8 hover:bg-slate-50 w-auto max-w-fit shadow-inner mx-5 rounded-md p-5">
          {expenses.map((exp, index) => (
            <div key={index} className="mb-4">
              <span className="h-[90%] bg-teal-800 p-2 rounded-xl mr-3 text-xl font-semibold text-white">
                {exp.date}
              </span>
              <span className="h-[90%] bg-teal-800 p-2 rounded-xl mr-3 text-xl font-medium text-white">
                Rs. {exp.expenseamount} - {exp.description}
              </span>
              <button
                onClick={() => editHandler(exp)}
                type="button"
                className="text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-3"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteHandler(exp)}
                className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                Delete
              </button>
            </div>
          ))}
          {/* Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      )}

      {/* For Download List Of Previous Downloaded Expense */}

      {isPremiumUser && previousDownloadExpense.length > 0 && (
        <div className="max-h-fit h-fit bg-neutral-100 mt-8 hover:bg-slate-50 w-auto max-w-fit shadow-inner mx-5 rounded-md p-5">
          {previousDownloadExpense.map((exp, index) => (
            <div key={index} className="mb-4">
              <span className="h-[90%] bg-teal-800 p-2 rounded-xl mr-3 text-xl font-medium text-white">
                Previous Expense {exp.id}
              </span>
              <button
                onClick={() => (window.location.href = exp.url)}
                type="button"
                className="text-gray-900 bg-gradient-to-r from-amber-400 via-yellow-300 to-red-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-3"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
