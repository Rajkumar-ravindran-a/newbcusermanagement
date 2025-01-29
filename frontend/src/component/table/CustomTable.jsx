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
  CircularProgress,
} from "@mui/material";
import { Button } from "@nextui-org/react";

const CustomTable = ({
  title = [],
  columnWidths = [],
  tableData = [],
  renderAction,
  loading,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
    <Paper className="custom">
      <TableContainer>
        <Table className="tble-custom">
          <TableHead>
            <TableRow>
              {title.map((header, index) => {
                // Merge "Gross Fund" if it exists
                if (header === "Gross Fund") {
                  return (
                    <TableCell
                      key="grossFund"
                      align="center"
                      sx={{ fontWeight: "bold", minWidth: 200, maxWidth: 300 }}
                    >
                      <TableSortLabel
                        active={sortConfig.key === "grossFund"}
                        direction={
                          sortConfig.key === "grossFund"
                            ? sortConfig.direction
                            : "asc"
                        }
                        onClick={() => handleSort("grossFund")}
                      >
                        Gross Fund (Fund | Interest | Sharing)
                      </TableSortLabel>
                    </TableCell>
                  );
                }
                return (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      width: columnWidths[index] || "auto",
                      minWidth: columnWidths[index] || 150,
                      maxWidth: columnWidths[index] || 300,
                    }}
                  >
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
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={title.length} className="middle-noData">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
            {paginatedData.map((rowData, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.keys(rowData).map((key, colIndex) => {
                  if (
                    [
                      "status",
                      "id",
                      "brokerId",
                      "fundAllocated",
                      "Record Id",
                    ].includes(key)
                  )
                    return null;

                  // Merge "Gross Fund" columns dynamically
                  if (key === "grossFund") {
                    return (
                      <TableCell
                        key={`${rowIndex}-grossFund`}
                        align="center"
                        sx={{
                          minWidth: 200,
                          maxWidth: 300,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {`${rowData["grossFund"]} | ${rowData["grossFundInterest"]} | ${rowData["grossFundSharing"]}`}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      key={`${rowIndex}-${colIndex}`}
                      align="center"
                      sx={{
                        width: columnWidths[colIndex] || "auto",
                        minWidth: columnWidths[colIndex] || 150,
                        maxWidth: columnWidths[colIndex] || 300,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
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
            {!loading && paginatedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={title.length}
                  className="middle-noData"
                  align="center"
                >
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={tableData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
      />
    </Paper>
  );
};

export default CustomTable;
