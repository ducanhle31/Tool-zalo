import { flatten } from "safe-flat";
import xlsx from "xlsx";

export const createExcelFile = ({
  data,
  filePath = "exports/data.xlsx",
  sheetName = "Data",
}: {
  data: any[];
  filePath?: string;
  sheetName?: string;
}) => {
  const formattedData = data.map((item) => flatten(item));
  const worksheet = xlsx.utils.json_to_sheet(formattedData);

  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);

  xlsx.writeFile(workbook, filePath);

  return filePath;
};
