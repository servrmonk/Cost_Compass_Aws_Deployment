import React, { useContext } from "react";
import { UserContext } from "../store/context";

export default function LeatherBoard() {
  const { leaderBoardData } = useContext(UserContext);
  // console.log("leaderBoardData => ", leaderBoardData);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-[30%] bg-neutral-200 p-3 h-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              User name
            </th>
            <th scope="col" className="px-6 py-3">
              Total Expense
            </th>
          </tr>
        </thead>
        <tbody>
          {leaderBoardData.map((user, index) => (
            <tr
              key={index}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {user.name}
              </th>
              <td className="px-6 py-4">
                {user.totalExpense}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
