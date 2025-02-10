import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  onRowClick,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const excludedKeys = [
    "status",
    "id",
    "brokerId",
    "fundAllocated",
    "Record Id",
    "Gross Fund Interest",
    "Gross Fund Sharing",
    "Arbitrage Fund Interest",
    "Arbitrage Fund Sharing",
    "Prop Fund Interest",
    "Prop Fund Sharing",
    "Cost Per Cr",
    "b2pFundsharing",
    "b2pFundInterest",
    "clientFundSharing",
    "clientFundInterest",
  ];

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

  return (
    <Paper className="custom">
      <TableContainer className="tble-container">
        <Table className="tble-custom" stickyHeader>
          <TableHead>
            <TableRow className="tble-head">
              {title
                .filter((header) => !excludedKeys.includes(header))
                .map((header, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{
                      width: columnWidths[index] || "auto",
                      minWidth: columnWidths[index] || 150,
                      maxWidth: columnWidths[index] || 300,
                      position: "sticky",
                      top: 0,
                      backgroundColor: "white",
                      zIndex: 2,
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
                      {header?.toUpperCase()}
                    </TableSortLabel>
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>

          <TableBody className="tble-body">
            {loading && (
              <TableRow>
                <TableCell colSpan={title.length} className="middle-noData">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
            {sortedData.map((rowData, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(rowData)}
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                  "&:hover": onRowClick ? { backgroundColor: "#f0f0f0" } : {},
                }}
              >
                {Object.keys(rowData)
                  .filter((key) => !excludedKeys.includes(key)) // Exclude columns
                  .map((key, colIndex) => (
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
                          onPress={(e) => {
                            e.stopPropagation();
                            renderAction(rowData["id"]);
                          }}
                        >
                          {rowData["status"] === 1 ? "Release" : "Released"}
                        </Button>
                      ) : (
                        rowData[key]
                      )}
                    </TableCell>
                  ))}
              </TableRow>
            ))}
            {!loading && sortedData.length === 0 && (
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
    </Paper>
  );
};

export default CustomTable;
