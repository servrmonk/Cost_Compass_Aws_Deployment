import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, setItemsPerPage }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="flex items-center space-x-2 mb-4">
        <label htmlFor="itemsPerPage" className="text-lg">Show</label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="px-3 py-2 border rounded-md"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <span className="text-lg">expenses per page</span>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <span className="px-4 py-2">{currentPage} of {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
