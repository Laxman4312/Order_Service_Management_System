import { useState } from 'react';

export const usePagination = ({ initialRowsPerPage = 20, totalCount = 0 }) => {
  const [page, setPage] = useState(0);
  // const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when changing rows per page
  };

  return {
    page,
    rowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    totalCount,
    // handleCountChange,
  };
};
