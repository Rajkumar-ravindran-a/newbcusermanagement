import React, { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Navbar = () => {
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
        <ul>
          <li
            className={
              activePage === "/dashboard" ? "active navmenuitem" : "navmenuitem"
            }
            onClick={() => handleNavigation("/dashboard")}
          >
            <RxDashboard className="listIcons" />
            Dashboard
          </li>
          <li
            className={
              activePage === "/allemployees"
                ? "active navmenuitem"
                : "navmenuitem"
            }
            onClick={() => handleNavigation("/allemployees")}
          >
            <FaUsers className="listIcons" /> All Employees
          </li>
          <li
            className={
              activePage === "/settings" ? "active navmenuitem" : "navmenuitem"
            }
            onClick={() => handleNavigation("/settings")}
          >
            <IoSettingsOutline className="listIcons" />
            Settings
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
