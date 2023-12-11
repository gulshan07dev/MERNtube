import React from "react";
import { Menu } from "@mui/icons-material";
import { navHeight } from "../../constant";

export default function Navbar() {
  return (
    <nav
      className={`w-full flex justify-between items-center md:px-7 sticky top-0 z-50`}
      style={{ height: navHeight }}
      role="navigation"
      aria-label="Primary Navigation"
    >
      <div className="flex gap-2 items-center">
        <button className="text-2xl text-gray-600 font-light">
          <Menu />
        </button>
        <div className="w-[170px]">
          <img src="/logo.png" alt="Logo" />
        </div>
      </div>
    </nav>
  );
}
