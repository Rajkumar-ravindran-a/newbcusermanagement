import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { Button } from "@nextui-org/react";

const CustomTable = ({ title = [], tableData = [], renderAction }) => {
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for sorting
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle sorting
  const handleSort = (columnKey) => {
    setSortConfig((prevConfig) => {
      const isAscending =
        prevConfig.key === columnKey && prevConfig.direction === "asc";
      return {
        key: columnKey,
        direction: isAscending ? "desc" : "asc",
      };
    });
  };

  // Sort data based on the sort configuration
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return tableData;
    return [...tableData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [tableData, sortConfig]);

  // Paginate the sorted data
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleButtonClick = (status, id) => {
    if (status === 1) {
      renderAction(id);
    } else {
      renderAction();
    }
  };

  return (
    <TableContainer component={Paper} className="custom">
      <Table>
        {/* Table Header with Sorting */}
        <TableHead>
          <TableRow>
            {title.map((header, index) => (
              <TableCell key={index} align="center" sx={{ fontWeight: "bold" }}>
                <TableSortLabel
                  active={sortConfig.key === header.toLowerCase()}
                  direction={
                    sortConfig.key === header.toLowerCase()
                      ? sortConfig.direction
                      : "asc"
                  }
                  onClick={() => handleSort(header.toLowerCase())}
                >
                  {header}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Table Body */}
        <TableBody>
          {paginatedData.map((rowData, rowIndex) => (
            <TableRow key={rowIndex}>
              {Object.keys(rowData).map((key, colIndex) => {
                // Skip specific keys dynamically
                
                if (["status", "id", "brokerId", "fundAllocated", "Record Id"].includes(key)) return null;
                return (
                  <TableCell key={`${rowIndex}-${colIndex}`} align="center">
                    {key === "action" && renderAction ? (
                      <Button
                        isDisabled={rowData["status"] === 3}
                        onPress={() =>
                          handleButtonClick(rowData["status"], rowData["id"])
                        }
                      >
                        {rowData["status"] === 1 ? "Release" : "Released"}
                      </Button>
                    ) : (
                      rowData[key]
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
          {
            paginatedData && paginatedData.length === 0 && (
              <TableRow style={{ textAlign: 'center' }}>
                <TableCell colSpan={title.length} className="middle-noData">No data found.</TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <TablePagination
        component="div"
        count={tableData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />
    </TableContainer>
  );
};

export default CustomTable;
