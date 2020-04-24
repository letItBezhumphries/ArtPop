import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CurrentInventory from "../layout/admin/artwork/CurrentInventory";

const Sidebar = (props) => {
  // let location = useLocation();
  // let content;
  // useEffect(() => {
  //   if (location.pathname === "/admin/artwork") {
  //     content = <CurrentInventory />;
  //   }
  //   content = <CurrentInventory />;
  // }, []);
  return (
    <div className="sidebar">
      <CurrentInventory />
    </div>
  );
};

export default Sidebar;
