import React, { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { RiStockFill } from "react-icons/ri";
import { TiDocumentText } from "react-icons/ti";
import { MdDataSaverOn } from "react-icons/md";

const Navbar = ({ role }) => {
  const location = useLocation();

  const [activePage, setActivePage] = useState(location?.pathname);

  const navigate = useNavigate();

  const handleNavigation = (path) => {
    setActivePage(path);
    navigate(path);
  };

  return (
    <div className=" p-14 h-full w-[100%] navmain">
      <div className="h-[10%] nav-logo">
        <h1 className="nav-logo text-2xl font-bold">Bulls Catch</h1>
      </div>
      <div className="navmenuItems">
        {role === 1 && (
          <ul>
            <li
              className={
                activePage === "/home" ? "active navmenuitem" : "navmenuitem"
              }
              onClick={() => handleNavigation("/home")}
            >
              <RxDashboard className="listIcons" />
              Dashboard
            </li>
            <li
              className={
                activePage === "/dashboard"
                  ? "active navmenuitem"
                  : "navmenuitem"
              }
              onClick={() => handleNavigation("/dashboard")}
            >
              <FaUsers className="listIcons" />
              Users
            </li>
            <li
              className={
                activePage === "/brokers" ? "active navmenuitem" : "navmenuitem"
              }
              onClick={() => handleNavigation("/brokers")}
            >
              <RiStockFill className="listIcons" />
              Brokers
            </li>
            <li
              className={
                activePage === "/ids" ? "active navmenuitem" : "navmenuitem"
              }
              onClick={() => handleNavigation("/ids")}
            >
              <TiDocumentText className="listIcons" />
              Id
            </li>
          </ul>
        )}
        {
          (role === 2 || role === 3) && (
            <ul>
              <li
                className={
                  activePage === "/datamanagement"? "active navmenuitem" : "navmenuitem"
                }
                onClick={() => handleNavigation("/datamanagement")}
              >
                <MdDataSaverOn className="listIcons" />
                Data Management
              </li>
            </ul>
          )
        }
      </div>
    </div>
  );
};

export default Navbar;
