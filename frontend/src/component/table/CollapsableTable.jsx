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
  Collapse,
  IconButton,
} from "@mui/material";
import { Button } from "@nextui-org/react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const CollapsableTable = ({
  title = [],
  columnWidths = [],
  tableData = [],
  renderAction,
  loading,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [expandedRow, setExpandedRow] = useState(null);

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

  const handleExpandClick = (rowIndex) => {
    setExpandedRow((prev) => (prev === rowIndex ? null : rowIndex));
  };

  return (
    <Paper className="custom">
      <TableContainer className="tble-container">
        <Table className="tble-custom" stickyHeader>
          <TableHead>
            <TableRow className="tble-head">
              <TableCell /> {/* Expand/Collapse Column */}
              {title.map((header, index) => (
                <TableCell
                  key={index}
                  align="center"
                  sx={{
                    // fontWeight: "bold",
                    width: columnWidths[index] || "auto",
                    minWidth: columnWidths[index] || 150,
                    maxWidth: columnWidths[index] || 300,
                    position: "sticky",
                    top: 0,
                    backgroundColor: "white",
                    zIndex: 2,
                    padding: "10px 15px",
                    height: "44px",
                    fontSize: "16px",
                    fontWeight: 300,
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
                <TableCell colSpan={title.length + 1} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}

            {sortedData.map((rowData, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleExpandClick(rowIndex)}
                    >
                      {expandedRow === rowIndex ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>

                  {Object.keys(rowData)
                    .filter((key) => !excludedKeys.includes(key))
                    .map((key, colIndex) => {
                      if (key === "action" && renderAction) {
                        return (
                          <TableCell key={colIndex} align="center">
                            <Button
                              isDisabled={rowData.status === 3}
                              onPress={() => renderAction(rowData.id)}
                            >
                              {rowData.status === 1 ? "Release" : "Released"}
                            </Button>
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={colIndex}
                          align="center"
                          sx={{
                            minWidth: columnWidths[colIndex] || 150,
                            maxWidth: columnWidths[colIndex] || 300,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {rowData[key]}
                        </TableCell>
                      );
                    })}
                </TableRow>

                <TableRow>
                  <TableCell colSpan={title.length + 1} sx={{ p: 0 }}>
                    <Collapse
                      in={expandedRow === rowIndex}
                      timeout="auto"
                      unmountOnExit
                    >
                      <div
                        style={{
                          padding: 16,
                          backgroundColor: "#f9f9f9",
                          display: "flex",
                          gap: 4,
                        }}
                      >
                        {/* <strong>Details:</strong> */}
                        {/* {console.log(JSON.stringify(rowData, null, 2))} */}
                        {/* <pre>{JSON.stringify(rowData, null, 2)}</pre> */}
                        <Paper className="flex-1">
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    colSpan={3}
                                    sx={{ textAlign: "center" }}
                                  >
                                    Gross Fund
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>Fund</TableCell>
                                  <TableCell>Intrest %</TableCell>
                                  <TableCell>Sharing %</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>{rowData["Gross Fund"]}</TableCell>
                                  <TableCell>
                                    {rowData["Gross Fund Interest"]}%
                                  </TableCell>
                                  <TableCell>
                                    {rowData["Gross Fund Sharing"]}%
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>

                        <Paper className="flex-1">
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    colSpan={3}
                                    sx={{ textAlign: "center" }}
                                  >
                                    Arbitrage Fund
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>Fund</TableCell>
                                  <TableCell>Intrest %</TableCell>
                                  <TableCell>Sharing %</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>
                                    {rowData["Arbitrage Fund"]}
                                  </TableCell>
                                  <TableCell>
                                    {rowData["Arbitrage Fund Interest"]}%
                                  </TableCell>
                                  <TableCell>
                                    {rowData["Arbitrage Fund Sharing"]}%
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>

                        <Paper className="flex-1">
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    colSpan={3}
                                    sx={{ textAlign: "center" }}
                                  >
                                    Prop Fund
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>Fund</TableCell>
                                  <TableCell>Intrest %</TableCell>
                                  <TableCell>Sharing %</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>{rowData["Prop Fund"]}</TableCell>
                                  <TableCell>
                                    {rowData["Prop Fund Interest"]}%
                                  </TableCell>
                                  <TableCell>
                                    {rowData["Prop Fund Sharing"]}%
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>

                        {/* <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Column</TableCell>
                                <TableCell>Value</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.keys(rowData).map((key) => (
                                <TableRow key={key}>
                                  <TableCell>{key}</TableCell>
                                  <TableCell>{rowData[key]}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer> */}
                      </div>
                      <Paper sx={{ margin: "1rem" }}>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Cost per CR</TableCell>
                                <TableCell>Total Fund</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>{rowData["Cost Per Cr"]}</TableCell>
                                <TableCell>{rowData["Total Fund"]}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}

            {!loading && sortedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={title.length + 1}
                  align="center"
                  className="middle-noData"
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

export default CollapsableTable;
