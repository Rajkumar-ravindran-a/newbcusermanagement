import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  Pagination,
  Typography,
  TextField,
  Paper,
} from "@mui/material";

const statusColorMap = {
  Active: "success",
  paused: "warning",
  deleted: "error",
};

export const columns = [
  { name: "User ID", key: "id" },
  { name: "NAME", key: "name" },
  { name: "ROLE", key: "role" },
  { name: "STATUS", key: "userStatus" },
  { name: "ACTIONS", key: "actions" },
];

const TableComponent = ({ Userdata }) => {
  console.log("userData", Userdata);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Pagination Logic
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = Userdata.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey] || "N/A";

    switch (columnKey) {
      case "id":
        return (
          <div style={{ display: "flex", alignItems: "center", justifyContent:"center" }}>{user.id}</div>
        );

      case "name":
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={user.avatar}
              alt={user.firstName}
              style={{ marginRight: "10px" }}
            >
              {user.firstName?.charAt(0)?.toUpperCase() || ""}
            </Avatar>
            <div>
              <Typography variant="body1">
                {user.firstName + " " + user.lastName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {user.email}
              </Typography>
            </div>
          </div>
        );
      case "role":
        return (
          <div>
            <Typography variant="body1">{cellValue}</Typography>
            <Typography variant="body2" color="textSecondary">
              {user.team}
            </Typography>
          </div>
        );
      case "userStatus":
        return (
          <Typography
            variant="body2"
            color={
              statusColorMap[user.userStatus] || "textSecondary"
            } /* Color dynamically based on status */
          >
            {cellValue}
          </Typography>
        );
      case "actions":
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <Button variant="outlined" color="primary" size="small">
              Details
            </Button>
            <Button variant="outlined" color="secondary" size="small">
              Edit
            </Button>
            <Button variant="outlined" color="error" size="small">
              Delete
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <>
      <TableContainer>
        <Table sx={{ minHidth: "650px" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  {column.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((user) => (
                <TableRow key={user.id} hover>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {renderCell(user, column.key)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  align="center"
                  style={{ height: "200px" }}
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Typography variant="body2">Rows per page:</Typography>
          <TextField
            type="number"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value, 10) || 5)}
            style={{ width: "60px" }}
            size="small"
          />
        </div>
        <Pagination
          count={Math.ceil(Userdata.length / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </>
  );
};

export default TableComponent;
