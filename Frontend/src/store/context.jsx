import axios from "axios";
import { createContext, useEffect, useState } from "react";
// require("dotenv").config();

export const UserContext = createContext();

const axiosInstance = axios.create({
  // baseURL: "http://127.0.0.1:3002/api",
  baseURL: import.meta.env.VITE_BASEURL,
});

const UserContextProvider = ({ children }) => {
  const [login, setLogin] = useState(
    localStorage.getItem("userToken") || false
  );

  const [isPremiumUser, setPremiumUser] = useState(
    localStorage.getItem("premium") === "true"
  );

  const tokenId = localStorage.getItem("userToken") || null;

  const [userExpense, setUserExpense] = useState([]);
  const [leaderBoardData, setleaderBoardData] = useState([]);

  const [previousDownloadExpense, setpreviousDownloadExpense] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const addExpense = async (obj) => {
    // console.log("ob", obj);
    try {
      const response = await axiosInstance.post(`/expense/createExpense`, obj, {
        headers: {
          Authorization: tokenId,
        },
      });
      setUserExpense((exp) => [...exp, obj]);
    } catch (error) {
      console.log("Error in postData", error);
    }
  };

  const deleteExpense = async (expenseId) => {
    // console.log("expense id for delete", expenseId);
    try {
      const response = await axiosInstance.delete(
        `/expense/deleteExpense/${expenseId}`,
        {
          headers: {
            Authorization: tokenId,
          },
        }
      );
    } catch (error) {
      console.log("Error in postData", error);
    }
  };
  const editExpense = async (id, updatedExpense) => {
    try {
      const response = await axiosInstance.put(
        `/expense/updateExpense/${id}`,
        updatedExpense,
        {
          headers: {
            Authorization: tokenId,
          },
        }
      );
      setUserExpense((exp) =>
        exp.map((expense) =>
          expense.id === id ? { ...expense, ...updatedExpense } : expense
        )
      );
    } catch (error) {
      console.log("Error in update expense", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axiosInstance.get(`/expense/getExpenseById`, {
        headers: {
          Authorization: tokenId,
        },
      });
      setUserExpense(response.data);
      // console.log("response in useeffect ", response.data);
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    }
  };

  const BuyPremium = async () => {
    // console.log("Inside BuyPremium");
    try {
      const response = await axiosInstance.get(`order/premiummembership`, {
        headers: {
          Authorization: tokenId,
        },
      });
      // console.log("response in context.js buypremium", response);
      // console.log("response in context buypremium ", response.data);

      var options = {
        key: response.data.key_id,
        order_id: response.data.order.id,
        handler: async function (response) {
          const res = await axiosInstance.post(
            "/order/updatetransactionstatus",
            {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            },
            { headers: { Authorization: tokenId } }
          );
          console.log("Res in axios.post razorpay ", res);
          setPremiumUser(true);
          localStorage.setItem("premium", "true");
          alert("You are now premium user");
        },
      };
      const rzp1 = new Razorpay(options);
      rzp1.open();

      rzp1.on("payment.failed", (res) => {
        alert("Something went wrong");
      });
    } catch (error) {
      console.error("Failed to fetch premium", error);
    }
  };

  const handleLeaderBoard = async () => {
    try {
      const response = await axiosInstance.get(`/premium/showLeaderBoard`, {
        headers: {
          Authorization: tokenId,
        },
      });
      // console.log("hasndlerleaderboard ", response.data);
      setleaderBoardData(response.data);
      // console.log("response in leaderboard ", response.data);
    } catch (error) {
      console.error("Failed to fetch leaderboard", error);
    }
  };

  const forgetPassword = async (userData) => {
    console.log("inside forgotpassword ", userData);
    try {
      // if userData request id is present than
      if (userData.requestId) {
        console.log(
          "userdata.requestId  is present in context if block ",
          userData.requestId
        );
        try {
          const response = await axiosInstance.get(
            `/password/resetPasswordRequestExist/${userData.requestId}`,
            {
              headers: {
                Authorization: tokenId,
              },
            }
          );
          if (response.data.isActive && userData.password) {
            // now make the password and isActive Updation
            try {
              const response = await axiosInstance.put(
                `/password/updatePassword/${userData.requestId}`,
                userData
              );
              console.log("response in put updatePassword ", response);
            } catch (err) {
              console.log("Error in updating  password", err);
            }
          }
        } catch (error) {
          console.error("Failed to userData requestId", error);
        }
      } // if userData request id is not present
      else if (!userData.requestId) {
        console.log(
          "userdata.requestid is not present in else block ",
          userData.requestId
        );
        const response = await axiosInstance.post(
          `/password/forgotPassword`,
          userData,
          {
            headers: {
              Authorization: tokenId,
            },
          }
        );
        console.log("response in forgetPassword ", response);
        console.log("userdata.requestid is not persent in context ", userData);
      }
    } catch (error) {
      console.error("Failed to reset password", error);
    }
  };

  const downloadExp = async () => {
    // console.log("Inside download expense");
    try {
      const response = await axiosInstance.get(`/premium/downloadExpense`, {
        headers: {
          Authorization: tokenId,
        },
      });
      console.log("Response in download expense is ", response);
    } catch (err) {
      console.error("Failed to Download expenses", err);
    }
  };
  const downloadPreviousExpense = async () => {
    // console.log("Inside download previous  expense");
    try {
      const response = await axiosInstance.get(
        `/premium/downloadExpenseDetails`,
        {
          headers: {
            Authorization: tokenId,
          },
        }
      );
      // console.log("Response in download previous expense is ", response);
      setpreviousDownloadExpense(response.data);
    } catch (err) {
      console.error("Failed to Download previous  expenses", err);
    }
  };
  const Logout = () => {
    setLogin(false);
    localStorage.removeItem("userToken");
    setPremiumUser(false);
    localStorage.removeItem("premium");
  };

  const getExpenseAqPagination = async (rowsPerPage, page) => {
    console.log("Rowperpage in getexpensepagination ", rowsPerPage);
    console.log("page in getexpensepagination ", page);
    try {
      const response = await axiosInstance.get(
        `/expense/getExpenseForPagination?rowsperpage=${rowsPerPage}&page=${page}`,
        {
          headers: { Authorization: tokenId },
        }
      );
      console.log("Response.data ", response.data);
      setUserExpense(response.data.expenses);
      setTotalPages(Math.ceil(response.data.totalCount / rowsPerPage));
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to fetch paginated expenses", err);
    }
  };
  console.log("Current page in context ", currentPage);
  console.log("Total page in context ", totalPages);

  // DOWNLOADPREVIOUSEXPENSE IS COMMENTED BC UNNECESSARY AWS REQUEST

  useEffect(() => {
    downloadPreviousExpense();
    // getExpenseAqPagination(10, 1);
  }, []);

  // useEffect(() => {
  //   // downloadPreviousExpense();
  //   getExpenseAqPagination(10, 1);
  // }, []);

  useEffect(() => {
    // tokenId && fetchExpenses();
    handleLeaderBoard();
  }, [login]);
  // downloadPreviousExpense();

  return (
    <UserContext.Provider
      value={{
        login,
        setLogin,
        userExpense,
        addExpense,
        deleteExpense,
        editExpense,
        Logout,
        BuyPremium,
        isPremiumUser,
        setPremiumUser,
        leaderBoardData,
        forgetPassword,
        downloadExp,
        previousDownloadExpense,
        getExpenseAqPagination,
        currentPage,
        totalPages,
        setCurrentPage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
