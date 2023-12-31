import { useMemo } from "react";
import { useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { AiOutlineHome } from "react-icons/ai";
import { TfiVideoCamera, TfiVideoClapper } from "react-icons/tfi";
import { FaHouseUser } from "react-icons/fa";
import { RiVideoLine, RiHistoryFill } from "react-icons/ri";
import { MdOutlineWatchLater, MdOutlineFeedback } from "react-icons/md";
import { SlLike } from "react-icons/sl";
import { CiSettings } from "react-icons/ci";
import { IoIosHelpCircleOutline } from "react-icons/io";

import { sidebarWidth } from "@/constant";
import useSidebar from "@/hooks/useSidebar";
import MenuLink from "./MenuLink";
import Divider from "./Divider";
import SidebarToggleBtn from "../navbar/SidebarToggleBtn";
import Logo from "../Logo";

const Sidebar = ({ isHidden }) => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { isOpen, onClose } = useSidebar();

  const menuItems = useMemo(
    () => [
      { label: "Home", icon: <AiOutlineHome />, slug: "/", active: true },
      {
        label: "Shorts",
        icon: <TfiVideoCamera />,
        slug: "/shorts",
        active: true,
      },
      {
        label: "Subscriptions",
        icon: <TfiVideoClapper />,
        slug: "/subscriptions",
        active: true,
      },
    ],
    []
  );

  const userMenu = useMemo(
    () => [
      {
        label: "Your channel",
        icon: <FaHouseUser />,
        slug: `/${user?.username}`,
        active: isLoggedIn,
      },
      {
        label: "History",
        icon: <RiHistoryFill />,
        slug: "/history",
        active: true,
      },
      {
        label: "Your videos",
        icon: <RiVideoLine />,
        slug: "/your-videos",
        active: true,
      },
      {
        label: "Watch Later",
        icon: <MdOutlineWatchLater />,
        slug: "/watch-later",
        active: true,
      },
      {
        label: "Liked videos",
        icon: <SlLike />,
        slug: "/liked-videos",
        active: true,
      },
    ],
    [user, isLoggedIn]
  );

  const miscellaneousMenu = useMemo(
    () => [
      {
        label: "Settings",
        icon: <CiSettings />,
        slug: "/settings",
        active: true,
      },
      {
        label: "Help",
        icon: <IoIosHelpCircleOutline />,
        slug: "/help",
        active: true,
      },
      {
        label: "Send Feedback",
        icon: <MdOutlineFeedback />,
        slug: "/send-feedback",
      },
    ],
    []
  );

  return (
    <>
      <aside
        id="sidebar"
        className={twMerge(
          "h-full bg-white px-2 top-0 overflow-y-scroll z-50 max-md:fixed transition-all duration-500 delay-0",
          isOpen ? "left-0" : isHidden ? "left-[-100%]" : "max-md:left-[-100%]",
          isHidden ? ["fixed"] : ["md:sticky md:left-0"]
        )}
        style={{ width: sidebarWidth }}
        role="navigation"
      >
        <div
          className={`px-2 pb-2 flex flex-col gap-2 ${
            !isHidden && !isOpen ? "pt-4" : ""
          }`}
        >
          <div
            className={`sticky top-0 mb-2 bg-white items-center ${
              isHidden ? "flex" : "md:hidden flex"
            }`}
          >
            <SidebarToggleBtn />
            <Logo />
          </div>

          {/* Menu Items */}
          {menuItems.map(
            (menuItem) =>
              menuItem.active && <MenuLink key={menuItem.slug} {...menuItem} />
          )}
          <Divider />

          {/* User Menu */}
          {userMenu.map(
            (menuItem) =>
              menuItem.active && <MenuLink key={menuItem.slug} {...menuItem} />
          )}
          <Divider />

          {/* Miscellaneous Menu */}
          {miscellaneousMenu.map(
            (menuItem) =>
              menuItem.active && <MenuLink key={menuItem.slug} {...menuItem} />
          )}
          <Divider />

          <div className="p-3">
            <p className="text-sm font-hedvig_letters text-gray-700 leading-none">
              Made With <span className="text-lg text-red-600">❤</span>
              <br /> <span className="pl-3 font-Noto_sans">By Gulshan</span>
            </p>
          </div>
        </div>
      </aside>
      {/* overlay */}
      <div
        className={twMerge(
          "fixed z-[49] top-0 left-0 right-0 bottom-0 w-screen h-screen",
          isOpen && isHidden
            ? ["bg-gray-300 opacity-50"]
            : isOpen
            ? ["max-md:bg-white max-md:opacity-30 md:hidden"]
            : "hidden"
        )}
        onClick={onClose}
      ></div>
    </>
  );
};

export default Sidebar;
