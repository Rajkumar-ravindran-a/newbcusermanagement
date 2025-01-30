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
  IconButton,
  Pagination,
  Typography,
  TextField,
  Paper,
} from "@mui/material";
import { CiMenuKebab } from "react-icons/ci";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
} from "@nextui-org/react";

const statusColorMap = {
  Active: "success",
  paused: "warning",
  deleted: "error",
};

export const columns = [
  { name: "Name", key: "name" },
  { name: "User ID", key: "id" },
  { name: "Role", key: "role" },
  { name: "Status", key: "userStatus" },
  { name: "Phone Number", key: "phoneNumber" },
  { name: "Actions", key: "actions" },
];

const TableComponent = ({ Userdata, onUpdateClick, onDeleteClick }) => {
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {user.id}
          </div>
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
              {/* <Typography variant="caption" color="textSecondary">
                {user.email}
              </Typography> */}
            </div>
          </div>
        );
      case "role":
        return (
          <div>
            <Typography variant="body1">{cellValue}</Typography>
            {/* <Typography variant="body2" color="textSecondary">
              {user.team}
            </Typography> */}
          </div>
        );
      case "userStatus":
        return (
          <Chip >{cellValue}</Chip>
          // <Typography
          //   variant="body2"
          //   color={statusColorMap[user.userStatus] || "textSecondary"} // Dynamically color based on status
          // >
          //   {cellValue}
          // </Typography>
        );
      case "actions":
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <Dropdown>
              <DropdownTrigger>
                <IconButton>
                  <CiMenuKebab />
                </IconButton>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Action menu"
                onAction={(key) => {
                  if (key === "update") {
                    onUpdateClick(user); // Trigger update for user
                  } else if (key === "delete") {
                    onDeleteClick(user.id); // Trigger delete for user
                  }
                }}
              >
                {console.log("Action menu " + user.userStatus)}
                <DropdownItem
                  key="update"
                  isDisabled={user.userStatus === "Deactive"}
                >
                  Update Employee
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  isDisabled={user.userStatus === "Deactive"}
                >
                  Delete Employee
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  };

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="user table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  style={{
                    fontWeight: "300",
                    // textTransform: "uppercase",
                    padding: "10px 15px",
                    color:"#A2A1A8"
                  }}
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
                    <TableCell
                      key={column.key}
                      sx={{
                        padding: "10px 15px",
                        height: "44px",
                        fontSize: "16px",
                        fontWeight: 300
                      }}
                    >
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
                  <Typography variant="h6">No data available</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination and rows per page control */}
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
