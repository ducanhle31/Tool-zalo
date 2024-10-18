import { getTheme } from "@table-library/react-table-library/baseline";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";

export const Table = ({ nodes, columns }: { nodes: any[]; columns: any[] }) => {
  const theme = useTheme([
    getTheme(),
    {
      HeaderRow: `
            background-color: #F0F0F0;
          `,
      Row: `
            &:nth-of-type(odd) {
              background-color: #FCFCFC;
            }
    
            &:nth-of-type(even) {
              background-color: #F0F0F0;
            }
          `,
    },
  ]);

  return <CompactTable columns={columns} data={{ nodes }} theme={theme} />;
};
