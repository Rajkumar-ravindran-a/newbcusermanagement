import React from "react";
import Navbar from "./adminLayoutComponents/Navbar";
import { Button, decomposeColor, Typography } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
import { jwtDecode } from "jwt-decode";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

const AdminLayout = ({ children, pageTitle, pageSubtitle }) => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  console.warn(decoded)
  const handleLogout = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  return (
    <div className="flex h-full w-full gap-2">
      <div className="adminLayoutNavbar">
        <Navbar role={decoded.role}/>
      </div>
      <div className="adminLayoutBody">
        <div className="flex justify-between w-full">
          <div>
            <Typography variant="h4" className="font-bold">
              {pageTitle}
            </Typography>
            <Typography variant="subtitle2" className="authlayoutsubtitle">
              {pageSubtitle}
            </Typography>
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button className="profile-btn flex align-middle">
                <div className="flex justify-evenly align-middle gap-2">
                  <Avatar
                    style={{
                      width: "40px",
                      height: "40px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                    name={decoded.fullName.charAt(0).toUpperCase()}
                    src=""
                  />
                  <div className="details-user">
                    <p className="details-user-name">{decoded.fullName}</p>
                    <Typography variant="caption details-user-role">
                      {decoded.roleName}
                    </Typography>
                  </div>
                  <div className="mt-2">
                    <IoIosArrowDown />
                  </div>
                </div>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions" variant="faded">
              {/* <DropdownItem key="new">New file</DropdownItem>
              <DropdownItem key="copy">Copy link</DropdownItem>
              <DropdownItem key="edit">Edit file</DropdownItem> */}
              <DropdownItem key="delete" className="text-danger" color="danger">
                <Button className="w-full text-danger" onClick={handleLogout}>
                  Logout
                </Button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
