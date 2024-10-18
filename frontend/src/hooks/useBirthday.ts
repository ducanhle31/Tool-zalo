"use client";

import { useEffect, useState } from "react";

export const useBirthday = () => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  const currentYear = new Date().getFullYear();

  // Tạo danh sách năm từ 1900 đến năm hiện tại
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_v, i) => 1930 + i
  );

  // Tạo danh sách tháng từ 1 đến 12
  const months = Array.from({ length: 12 }, (_v, i) => i + 1);

  // Tạo danh sách ngày dựa trên tháng và năm đã chọn
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      const year = parseInt(selectedYear, 10);
      const month = parseInt(selectedMonth, 10);
      const days = getDaysInMonth(year, month);
      setDaysInMonth(Array.from({ length: days }, (_v, i) => i + 1));
    } else {
      setDaysInMonth([]);
    }
  }, [selectedYear, selectedMonth]);

  // Hàm tính số ngày trong một tháng, bao gồm cả năm nhuận
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  return {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    years,
    months,
    daysInMonth,
  };
};
