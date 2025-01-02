import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const CustomTable = ({ title = [], tableData = [], renderAction }) => {
  return (
    <TableContainer component={Paper} className="custom">
      <Table>
        {/* Table Header */}
        <TableHead>
          <TableRow>
            {title.map((header, index) => (
              <TableCell key={index} align="center" sx={{ fontWeight: "bold" }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {/* Table Body */}
        <TableBody>
          {tableData.map((rowData, rowIndex) => (
            <TableRow key={rowIndex}>
              {Object.keys(rowData).map((key, colIndex) => (
                <TableCell key={`${rowIndex}-${colIndex}`} align="center">
                  {key === "action" && renderAction ? (
                    renderAction(rowData[key]) // Pass the full `rowData` to the action renderer
                  ) : (
                    rowData[key]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
