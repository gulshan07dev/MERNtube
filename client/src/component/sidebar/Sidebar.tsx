import { useMemo, useRef } from "react";
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

import { AppDispatch, RootState } from "@/store/store";
import { onClose, onOpen } from "@/store/slices/sidebarSlice";
import MenuLink from "./MenuLink";
import Divider from "../Divider";
import SidebarToggleBtn from "./SidebarToggleBtn";
import Logo from "../CoreUI/Logo";
import useScroll from "@/hooks/useScroll";

const Sidebar = ({
  byDefaultSidebarHidden = false,
}: {
  byDefaultSidebarHidden?: boolean;
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state: RootState) => state?.auth);
  const { isOpen } = useSelector((state: RootState) => state.sidebar);
  const bottomNavigationBar = useRef<HTMLDivElement>(null);

  const onSidebarToggle = () => {
    isOpen ? dispatch(onClose()) : dispatch(onOpen());
  };

  const menuItems = useMemo(
    () => [
      { label: "Home", icon: <AiOutlineHome />, slug: "/", active: true },
      {
        label: "Subscriptions",
        icon: <TfiVideoClapper />,
        slug: "/feed/subscriptions",
        active: true,
      },
      {
        label: "Create",
        icon: <MdCloudUpload />,
        slug: "/create",
        active: true,
      },
      {
        label: "Your channel",
        icon: <FaHouseUser />,
        slug: `/c/${user?.username}`,
        active: isLoggedIn && user,
      },
    ],
    []
  );

  const userMenu = useMemo(
    () => [
      {
        label: "History",
        icon: <RiHistoryFill />,
        slug: "/feed/history",
        active: true,
      },
      {
        label: "Your videos",
        icon: <RiVideoLine />,
        slug: "/dashboard#your-videos",
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
        active: true,
      },
    ],
    []
  );

  const handleScrollDown = () => {
    bottomNavigationBar.current?.classList.add("max-md:bottom-[-60px]");
  };

  const handleScrollUp = () => {
    bottomNavigationBar.current?.classList.remove("max-md:bottom-[-60px]");
    bottomNavigationBar.current?.classList.add("max-md:bottom-0");
  };

  useScroll(handleScrollDown, handleScrollUp);

  return (
    <>
      <aside
        id="sidebar"
        className={twMerge(
          "lg:h-[calc(100vh-60px)] h-screen w-[245px] lg:pt-2 bg-white dark:bg-dark_bg max-lg:fixed lg:sticky lg:top-[60px] top-0 z-[100] overflow-y-scroll scrollbar-show-on-hover",
          "transition-[left] duration-500 delay-0",
          isOpen ? ["max-lg:left-0"] : ["max-lg:left-[-100%]"],
          byDefaultSidebarHidden
            ? isOpen
              ? ["lg:h-screen lg:fixed lg:top-0 lg:left-0"]
              : ["lg:h-screen lg:fixed lg:top-0 left-[-100%]"]
            : ["lg:sticky lg:left-0"]
        )}
        role="navigation"
      >
        <div className={twMerge("px-2 pb-2 flex flex-col gap-2.5")}>
          <div
            className={twMerge(
              "sticky top-0 pt-2 px-2 mb-2 bg-white dark:bg-dark_bg items-center gap-3 hidden",
              isOpen && ["max-lg:flex"],
              byDefaultSidebarHidden && ["lg:flex"]
            )}
          >
            <SidebarToggleBtn />
            <Logo />
          </div>

          {/* Menu Items */}
          <div
            ref={bottomNavigationBar}
            className={twMerge(
              "flex md:flex-col gap-2.5",
              "max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:w-full max-md:h-[60px] max-md:justify-evenly max-md:bg-white dark:max-md:bg-dark_bg max-md:border dark:max-md:border-[#121212] max-md:items-center max-md:transition-all",
              isOpen && ["max-md:bottom-[-60px]"]
            )}
          >
            {menuItems.map(
              (menuItem) =>
                menuItem.active && (
                  <MenuLink
                    key={menuItem.slug}
                    {...menuItem}
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
              menuItem.active && <MenuLink key={menuItem.slug} {...menuItem} />
          )}
          <Divider />

          {/* Miscellaneous Menu */}
          {miscellaneousMenu.map(
            (menuItem) =>
              menuItem.active && <MenuLink key={menuItem.slug} {...menuItem} />
          )}
          <Divider />

          <div className="px-3 pb-3">
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
          "fixed z-[51] top-0 left-0 right-0 bottom-0 w-screen h-screen hidden",
          "bg-white opacity-30",
          isOpen && "max-lg:block",
          byDefaultSidebarHidden && isOpen && "block"
        )}
        onClick={onSidebarToggle}
      ></div>
    </>
  );
};

export default Sidebar;
