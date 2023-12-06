import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
// import { useQuery } from "react-query";
// import { getCurrentUser } from "../api";
// import { GlobalContext } from "../contexts/GlobalContexts";

const Layout = () => {
  // const { data: currentUser, isLoading } = useQuery(
  //   "get_current_user",
  //   getCurrentUser
  // );

  return (
    // <GlobalContext.Provider
    //   value={{ currentUser, isCurrentUserLoading: isLoading }}
    // >
    <div
      style={{
        backgroundColor: "#000657",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
    // </GlobalContext.Provider>
  );
};

export default Layout;