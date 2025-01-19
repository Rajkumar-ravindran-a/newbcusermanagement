import React, { useState, useCallback } from "react";
import { CgMoreO } from "react-icons/cg";
import { Pagination } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Typography } from "@mui/material";
import { Avatar } from "@nextui-org/react";

export const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "userStatus" },
  { name: "ACTIONS", uid: "actions" },
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
            {/* <img
              src={user.avatar}
              alt={user.firstName}
              style={{
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                marginRight: "10px",
              }}
            /> */}
            <Avatar
              style={{ width: "40px", height: "40px", marginRight: "10px", fontSize:'1rem', fontWeight: "bold" }}
              src={user.avatar}
              name={user.firstName.charAt(0).toUpperCase()}
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
          minHeight: "17rem",
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
