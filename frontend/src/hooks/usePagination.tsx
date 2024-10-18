import { useState } from "react";

const usePagination = ({
  total,
  perpage,
}: {
  total: number;
  perpage: number;
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(total / perpage);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  };
};

export default usePagination;
