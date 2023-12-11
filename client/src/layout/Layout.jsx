import React from "react";
import Navbar from "../component/navbar/Navbar";
import Sidebar from "../component/sidebar/Sidebar";
import { navHeight } from "../constant";

export default function Layout({ children }) { 
  const containerStyle = {
    height: `calc(100vh - ${navHeight})`,
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle} className="w-full bg-red-500 flex overflow-y-scroll">
        <Sidebar />
        <main className="flex-1 flex-grow">{children}</main>
      </div>
    </>
  );
}
