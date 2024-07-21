import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExpensePage from "./ExpensePage";
import { UserContext } from "../store/context";
import DownloadExpense from "./DownloadExpense";

function Navbar() {
  const { Logout, BuyPremium, isPremiumUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("isPremiumUser on load: ", isPremiumUser);
  }, [isPremiumUser]);

  const handleLogout = () => {
    Logout();
    navigate("/login");
  };

  const premiumHandler = () => {
    console.log("Inside premium handler");
    BuyPremium();
  };

  return (
    <>
      <div className="max-w-[auto] flex justify-between bg-slate-300 p-3 shadow-lg shadow-indigo-500/40">
        <p className="text-2xl font-sans">Welcome to Expense Tracker</p>
        <div className="flex mx-1 items-center">
          {isPremiumUser ? (
            <>
              <button
                type="button"
                className="text-pretty hover:cursor-not-allowed bg-gradient-to-br from-orange-500 to-yellow-100 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2"
              >
                Premium user :)
              </button>
              <DownloadExpense />
            </>
          ) : (
            <button
              onClick={premiumHandler}
              type="button"
              className="text-pretty bg-gradient-to-br from-orange-300 to-yellow-300 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2"
            >
              Buy Premium
            </button>
          )}
          <button
            onClick={handleLogout}
            type="button"
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Logout
          </button>
        </div>
      </div>
      <ExpensePage />
    </>
  );
}

export default Navbar;
