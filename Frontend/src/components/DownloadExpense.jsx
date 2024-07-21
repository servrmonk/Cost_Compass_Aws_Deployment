import React, { useContext, useRef } from "react";
import { UserContext } from "../store/context";
import { CSVLink } from "react-csv";

function DownloadExpense() {
  const { userExpense, downloadExp } = useContext(UserContext);
  const csvLinkRef = useRef(null);

  // Prepare the data for CSV
  const csvData = userExpense.map((expense) => ({
    id: expense.id,
    amount: expense.expenseamount,
    category: expense.category,
    date: expense.date,
    description: expense.description,
  }));

  // Function to trigger CSV download
  const handleDownload = () => {
    // if (csvLinkRef.current) {
      // csvLinkRef.current.link.click();
    // }
    // console.log("Inside handle download in  frontend download expense ");
    downloadExp();
  };

  return (
    <div className="flex items-center">
      {/* Use a CSVLink component but hide it */}
      {/* <CSVLink
        data={csvData}
        filename={"expenses.csv"}
        className="hidden"
        ref={csvLinkRef}
      /> */}

      <button
        onClick={handleDownload} // Trigger CSV download on button click
      >
        <img
          src="https://img.icons8.com/?size=100&id=VGQlJM067vkN&format=png&color=000000"
          alt="Download-Icon"
          className="w-10 h-10 mr-2 "
        />
      </button>
    </div>
  );
}

export default DownloadExpense;
