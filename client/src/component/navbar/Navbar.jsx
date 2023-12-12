import React from "react";

import { Menu } from "@mui/icons-material";
import { navHeight } from "../../constant";
import { MdOutlineVideoCall, MdOutlineNotifications } from "react-icons/md";
import Logo from "../Logo";
import SearchBar from "./SearchBar";
import useSidebar from "../../hooks/useSidebar";

export default function Navbar() {
  const {onToggle} = useSidebar()
  return (
    <nav
      className={`w-full flex justify-between items-center md:px-7 px-3 sticky top-0 z-50`}
      style={{ height: navHeight }}
      role="navigation"
      aria-label="Primary Navigation"
    >
      <div className="flex md:gap-2 gap-0 items-center">
        <button className="text-2xl text-gray-500 font-[100] hover:bg-[#f8f8f8]" onClick={onToggle}>
          <Menu />
        </button>
        <Logo />
      </div>
      <div className="max-sm:hidden">
        <SearchBar />
      </div>
      <div className="flex items-center gap-1">
        <button className="text-zinc-700 p-2 font-extralight rounded-full transition hover:bg-[#dfdfdf] hover:text-zinc-800">
          <MdOutlineVideoCall size={27} />
        </button>
        <button className="text-zinc-700 p-2 font-extralight rounded-full transition hover:bg-[#dfdfdf] hover:text-zinc-800">
          <MdOutlineNotifications size={27} />
        </button>
        <div className="avatar cursor-pointer w-8 h-8 rounded-full grid place-items-center text-lg bg-blue-500 text-white">
          G
        </div>
      </div>
    </nav>
  );
}
