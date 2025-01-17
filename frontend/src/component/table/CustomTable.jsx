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
import { Button } from "@nextui-org/react";

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
              {Object.keys(rowData).map((key, colIndex) => {
                if (key === "status") return null; 
                if (key === "id") return null;// Skip "status" key
                return (
                  <TableCell key={`${rowIndex}-${colIndex}`} align="center">
                    {key === "action" && renderAction
                      ? (<Button isDisabled={rowData["status"] == 3} onPress={()=>{
                        rowData["status"] == 1 ? renderAction(rowData["id"]) : renderAction()
                      }}>{ rowData["status"] == 1 ? "Release" : "Released"}</Button>) // Pass the full `rowData` to the action renderer
                      : rowData[key]}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
