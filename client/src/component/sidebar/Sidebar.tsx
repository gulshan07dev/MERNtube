import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { twMerge } from "tailwind-merge";
import { AiOutlineHome } from "react-icons/ai";
import { TfiVideoClapper } from "react-icons/tfi";
import { FaHouseUser } from "react-icons/fa";
import { RiVideoLine, RiHistoryFill } from "react-icons/ri";
import { MdOutlineWatchLater, MdOutlineFeedback } from "react-icons/md";
import { SlLike } from "react-icons/sl";
import { CiSettings } from "react-icons/ci";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { MdCloudUpload } from "react-icons/md";

import "./sidebar.css";
import { RootState } from "@/store/store";
import { onToggle } from "@/store/slices/sidebarSlice";
import { sidebarWidth } from "@/constant";
import MenuLink from "./MenuLink";
import Divider from "../Divider";
import SidebarToggleBtn from "../navbar/SidebarToggleBtn";
import Logo from "../CoreUI/Logo";
import Avatar from "../CoreUI/Avatar";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state: RootState) => state?.auth);
  const { isOpen, isOpenInMobile } = useSelector(
    (state: RootState) => state.sidebar
  );

  const menuItems = useMemo(
    () => [
      { label: "Home", icon: <AiOutlineHome />, slug: "/", active: true },
      {
        label: "Subscriptions",
        icon: <TfiVideoClapper />,
        slug: "/subscriptions",
        active: true,
      },
      {
        label: "Create",
        icon: <MdCloudUpload />,
        slug: "/create",
        active: true,
      },
      {
        label: "You",
        icon: (
          <Avatar
            fullName={user?.fullName}
            url={user?.avatar?.url}
            className="h-7 w-7"
          />
        ),
        slug: "/you",
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
        slug: `/c/${user?.username}`,
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
          "h-full bg-white dark:bg-dark_bg max-md:fixed top-0 z-50 overflow-y-scroll thin-scrollbar transition-[left] duration-500 delay-0",
          isOpen && ["max-lg:sticky max-lg:left-0 lg:fixed"],
          isOpenInMobile
            ? ["max-lg:left-0 max-lg:fixed"]
            : ["max-md:left-[-100%] max-lg:sticky"],
          ["lg:sticky left-0"]
        )}
        style={{
          width: isOpen ? (isOpenInMobile ? "auto" : sidebarWidth) : "auto",
        }}
        role="navigation"
      >
        <div
          className={twMerge(
            "px-2 pb-2 flex flex-col gap-2",
            !isOpen && ["lg:gap-5 pr-5"],
            !isOpenInMobile && [
              "max-lg:gap-5 max-md:gap-2 max-lg:pr-5 max-md:px-2",
            ]
          )}
        >
          <div
            className={twMerge(
              "sticky top-0 px-2 bg-white dark:bg-dark_bg items-center hidden",
              isOpenInMobile && "max-lg:flex"
            )}
          >
            <SidebarToggleBtn />
            <Logo />
          </div>

          {/* Menu Items */}
          <div
            className={twMerge(
              "md:pb-2 flex md:flex-col max-lg:gap-2 lg:gap-2 pt-2",
              "max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:w-full max-md:h-[60px] max-md:justify-evenly max-md:bg-white dark:max-md:bg-dark_bg max-md:border dark:max-md:border-[#121212] max-md:items-center max-md:transition-all",
              isOpen && ["md:gap-5"],
              !isOpen && ["lg:gap-5"],
              isOpenInMobile && ["max-md:-bottom-[60px]"]
            )}
          >
            {menuItems.map(
              (menuItem) =>
                menuItem.active && (
                  <MenuLink
                    key={menuItem.slug}
                    {...menuItem}
                    isLabelHiddenClassName={twMerge(
                      "max-lg:hidden",
                      !isOpen && "lg:hidden",
                      isOpenInMobile && "max-lg:block"
                    )}
                    className="max-md:flex-col max-md:justify-center max-md:items-center
                    max-md:gap-1 max-md:w-[20vw] max-md:text-xs"
                  />
                )
            )}
          </div>
          <Divider className="max-md:hidden" />

          {/* User Menu */}
          {userMenu.map(
            (menuItem) =>
              menuItem.active && (
                <MenuLink
                  key={menuItem.slug}
                  {...menuItem}
                  isLabelHiddenClassName={twMerge(
                    "max-lg:hidden",
                    !isOpen && "lg:hidden",
                    isOpenInMobile && "max-lg:block"
                  )}
                />
              )
          )}
          <Divider />

          {/* Miscellaneous Menu */}
          {miscellaneousMenu.map(
            (menuItem) =>
              menuItem.active && (
                <MenuLink
                  key={menuItem.slug}
                  {...menuItem}
                  isLabelHiddenClassName={twMerge(
                    "max-lg:hidden",
                    !isOpen && "lg:hidden",
                    isOpenInMobile && "max-lg:block"
                  )}
                />
              )
          )}
          <Divider />

          <div
            className={`px-3 pb-3 max-md:block ${!isOpen ? "md:hidden" : ""} ${
              !isOpenInMobile ? "max-lg:hidden" : ""
            }`}
          >
            <p className="text-sm font-hedvig_letters text-gray-700 dark:text-white leading-none">
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
          isOpen ? ["bg-white opacity-30 lg:hidden"] : "hidden",
          isOpenInMobile ? ["bg-white opacity-30 lg:hidden block"] : "hidden"
        )}
        onClick={() => dispatch(onToggle())}
      ></div>
    </>
  );
};

export default Sidebar;
