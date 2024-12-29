import React from "react";
import SideNavbar from "../sideNavbar/SideNavbar";

const MainPage = ({children}) => {
  return (
    <div className="layout-main">
      <SideNavbar />
      <div className="flex flex-1 p-4">
        {children}
      </div>
    </div>
  );
};

export default MainPage;
