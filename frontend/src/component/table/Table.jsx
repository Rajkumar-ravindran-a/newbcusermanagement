import React, { useState, useCallback } from "react";
import { CgMoreO } from "react-icons/cg";
import { Pagination } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Typography } from "@mui/material";

export const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "userStatus" },
  { name: "ACTIONS", uid: "actions" },
];

export const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "Admin",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "user",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "user",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    role: "user",
    team: "Marketing",
    status: "deleted",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    role: "user",
    team: "Sales",
    status: "active",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
];

const statusColorMap = {
  Active: "green",
  paused: "orange",
  deleted: "red",
};

const TableComponent = ({ Userdata }) => {
  console.log(Userdata, "Userdata");
  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={user.avatar}
              alt={user.firstName}
              style={{
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                marginRight: "10px",
              }}
            />
            <div>
              <strong>{cellValue}</strong>
              <p style={{ margin: 0, fontSize: "0.8em", fontWeight: "500" }}>
                {user.firstName}
              </p>
              <p style={{ margin: 0, fontSize: "0.8em", color: "gray" }}>
                {user.email}
              </p>
            </div>
          </div>
        );
      case "role":
        return (
          <div>
            <p style={{ margin: 0 }}>{cellValue}</p>
            <p style={{ margin: 0, fontSize: "0.8em", color: "gray" }}>
              {user.team}
            </p>
          </div>
        );
      case "status":
        return (
          <span
            style={{
              padding: "5px 10px",
              borderRadius: "15px",
              backgroundColor: statusColorMap[user.userStatus],
              color: "white",
              fontSize: "0.8em",
            }}
          >
            {cellValue}
          </span>
        );
      case "actions":
        return (
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              title="Details"
              style={{ cursor: "pointer", background: "none", border: "none" }}
            >
              👁️
            </button>
            <button
              title="Edit"
              style={{ cursor: "pointer", background: "none", border: "none" }}
            >
              ✏️
            </button>
            <button
              title="Delete"
              style={{
                cursor: "pointer",
                background: "none",
                border: "none",
                color: "red",
              }}
            >
              🗑️
            </button>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "1.5rem",
        }}
      >
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.uid}
                style={{
                  textAlign: "left",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Userdata.map((user) => (
            <tr key={user.id}>
              {columns.map((column) => (
                <td
                  key={column.uid}
                  style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                >
                  {renderCell(user, column.uid)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-6">
        <div className="flex gap-3 align-middle ">
          <Typography variant="subtitle1">Showing</Typography>
          <Input classNames="offset-input w-1" style={{ width: "1.5rem" }} />
        </div>
        <Pagination
          loop
          showControls
          color="success"
          initialPage={1}
          total={5}
        />
      </div>
    </div>
  );
};

export default TableComponent;
