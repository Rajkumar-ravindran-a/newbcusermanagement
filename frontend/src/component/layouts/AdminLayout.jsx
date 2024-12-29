import React from "react";
import Navbar from "./adminLayoutComponents/Navbar";
import { Typography } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";

const AdminLayout = ({ children, pageTitle, pageSubtitle }) => {
  return (
    <div className="flex h-full w-full gap-2">
      <div className="adminLayoutNavbar">
        <Navbar />
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
          <div className="profile-btn flex justify-evenly align-middle">
            <Avatar name="Jane" radius="sm" />
            <div className="details-user">
              <p className="details-user-name">Profile</p>
              <Typography variant="caption details-user-role">Role</Typography>
            </div>
            <div>
              <IoIosArrowDown />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
