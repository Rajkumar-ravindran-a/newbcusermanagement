import React, { useState, useMemo } from "react";
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
  headerTotal,
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
      const isAscending = prevConfig.key === columnKey && prevConfig.direction === "asc";
      return {
        key: columnKey,
        direction: isAscending ? "desc" : "asc",
      };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return tableData;

    return [...tableData].sort((a, b) => {
      const aValue = a[sortConfig.key] ?? "";
      const bValue = b[sortConfig.key] ?? "";

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return sortConfig.direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
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
                      active={sortConfig.key === header}
                      direction={sortConfig.key === header ? sortConfig.direction : "asc"}
                      onClick={() => handleSort(header)}
                    >
                      <div className="flex flex-col">
                        <div className="headertext">{header?.toUpperCase()}</div>
                        <div className="total-div">
                          {headerTotal && headerTotal?.length > 0 &&
                          Object.keys(headerTotal[0]).includes(header)
                            ? headerTotal[0][header]
                            : null}
                        </div>
                      </div>
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
                  .filter((key) => !excludedKeys.includes(key))
                  .map((key, colIndex) => (
                    <TableCell
                      key={`${rowIndex}-${colIndex}`}
                      align="center"
                      sx={{
                        width: columnWidths[colIndex] || "auto",
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
                <TableCell colSpan={title.length} className="middle-noData" align="center">
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
