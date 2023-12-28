import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { TfiVideoCamera, TfiVideoClapper } from "react-icons/tfi";
import { FaHouseUser } from "react-icons/fa";
import { RiVideoLine, RiHistoryFill } from "react-icons/ri";
import { MdOutlineWatchLater, MdOutlineFeedback } from "react-icons/md";
import { SlLike } from "react-icons/sl";
import { CiSettings } from "react-icons/ci";
import { IoIosHelpCircleOutline } from "react-icons/io";

import { navHeight, sidebarWidth } from "../../constant";
import useSidebar from "../../hooks/useSidebar";
import MenuLink from "./MenuLink";
import Divider from "./Divider";

export default function Sidebar() {
  const { isOpen, onToggle } = useSidebar();

  const mainMenu = [
    {
      label: "Home",
      icon: <AiOutlineHome />,
      slug: "/",
    },
    {
      label: "Shorts",
      icon: <TfiVideoCamera />,
      slug: "/shorts",
    },
    {
      label: "Subscriptions",
      icon: <TfiVideoClapper />,
      slug: "/subscriptions",
    },
  ];

  const userMenu = [
    {
      label: "Your channel",
      icon: <FaHouseUser />,
      slug: "/your-channel",
    },
    {
      label: "History",
      icon: <RiHistoryFill />,
      slug: "/history",
    },
    {
      label: "Your videos",
      icon: <RiVideoLine />,
      slug: "/your-videos",
    },
    {
      label: "Watch Later",
      icon: <MdOutlineWatchLater />,
      slug: "/watch-later",
    },
    {
      label: "Liked videos",
      icon: <SlLike />,
      slug: "/liked-videos",
    },
  ];

  const miscellaneousMenu = [
    {
      label: "Settings",
      icon: <CiSettings />,
      slug: "/settings",
    },
    {
      label: "Help",
      icon: <IoIosHelpCircleOutline />,
      slug: "/help",
    },
    {
      label: "Send Feedback",
      icon: <MdOutlineFeedback />,
      slug: "/send-feedback",
    },
  ];

  return (
    <aside
      id="sidebar"
      className={`h-full bg-white p-2 top-0 overflow-y-scroll md:sticky md:left-0 max-md:fixed  ${
        isOpen ? "max-md:left-0" : "max-md:left-[-100%]"
      }`}
      style={{ width: sidebarWidth, top: isOpen ? navHeight : 0 }}
      role="navigation"
    >
      <div className="p-2 flex flex-col gap-2">
        {/* Main Menu */}
        {mainMenu.map((menuItem) => (
          <MenuLink
            key={menuItem.slug}
            label={menuItem.label}
            icon={menuItem.icon}
            slug={menuItem.slug}
          />
        ))}
        <Divider />

        {/* User Menu */}
        {userMenu.map((menuItem) => (
          <MenuLink
            key={menuItem.slug}
            label={menuItem.label}
            icon={menuItem.icon}
            slug={menuItem.slug}
          />
        ))}
        <Divider />

        {/* Miscellaneous Menu */}
        {miscellaneousMenu.map((menuItem) => (
          <MenuLink
            key={menuItem.slug}
            label={menuItem.label}
            icon={menuItem.icon}
            slug={menuItem.slug}
          />
        ))}
        <Divider />

        <div className="p-3">
          <p className="text-sm font-hedvig_letters text-gray-700 leading-none">
            Made With <span className="text-lg text-red-600">❤</span>
            <br /> <span className="pl-3 font-Noto_sans">By Gulshan</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
