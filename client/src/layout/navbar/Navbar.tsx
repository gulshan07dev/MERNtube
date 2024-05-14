import { useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useRef } from "react";

import type { RootState } from "@/store/store";
import Logo from "@/component/CoreUI/Logo";
import SearchBar from "./SearchBar";
import Avatar from "@/component/CoreUI/Avatar";
import Button from "@/component/CoreUI/Button";
import DropdownMenu from "@/component/CoreUI/DropdownMenu";
import LogoutBtn from "./LogoutBtn";
import SidebarToggleBtn from "../sidebar/SidebarToggleBtn";
import Skeleton from "@/component/Skeleton";
import useScroll from "@/hooks/useScroll";

const Navbar = ({
  showSidebarToggleBtn,
}: {
  showSidebarToggleBtn: boolean;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const navbar = useRef<HTMLDivElement>(null);
  const { isAppLoading } = useSelector((state: RootState) => state.appLoading);
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  const handleScrollDown = () => {
    navbar.current?.classList.add("max-md:top-[-60px]");
  };

  const handleScrollUp = () => {
    navbar.current?.classList.remove("max-md:top-[-60px]");
    navbar.current?.classList.add("max-md:top-0");
  };

  useScroll(handleScrollDown, handleScrollUp);

  return (
    <nav
      className={`w-full h-[60px] bg-white dark:bg-dark_bg flex justify-between items-center sticky top-0 z-50 transition-[top] md:px-7 md:pl-5 px-3`}
      role="navigation"
      aria-label="Primary Navigation"
      ref={navbar}
    >
      {/* Left Section */}
      <div className="flex items-center gap-1">
        <SidebarToggleBtn
          className={showSidebarToggleBtn ? "lg:flex" : "lg:hidden"}
        />
        <Logo />
      </div>

      {/* Center Section */}
      <SearchBar />

      {/* Right Section */}
      <div className="flex items-center gap-1">
        {/* Display user information or login/signup buttons */}
        {/* If user is logged in, show user Dropdown menu */}
        {isAppLoading ? (
          <Skeleton className="w-10 h-10 rounded-full" />
        ) : (
          <DropdownMenu
            triggerButton={
              <Avatar
                url={user?.avatar || ""}
                fullName={user?.fullName || ""}
              />
            }
          >
            {/* User Information */}
            <div className="flex gap-3">
              <Avatar
                url={user?.avatar || ""}
                fullName={user?.fullName || ""}
              />
              {isLoggedIn && (
                <div className="flex flex-col min-w-[120px] max-w-[165px]">
                  <h1 className="text-base text-gray-900 dark:text-white font-roboto truncate">
                    {user?.fullName}
                  </h1>
                  <p className="text-sm text-gray-700 dark:text-[#AAAAAA] font-nunito leading-none truncate">
                    {user?.username}
                  </p>
                  {/* Link to user's channel */}
                  <Link
                    to={`/c/${user?.username}`}
                    className="text-[12px] text-blue-600 dark:text-blue-500 font-[600] font-nunito_sans leading-5"
                  >
                    View your channel
                  </Link>
                </div>
              )}
            </div>
            {isLoggedIn ? (
              <>
                {/* Dropdown Menu Options */}
                <Link
                  to="/account"
                  className="text-gray-700 dark:text-slate-300"
                >
                  Account & Password
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-700 dark:text-slate-300"
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="text-gray-700 dark:text-slate-300"
                >
                  Setting
                </Link>
                <hr />
                {/* logout */}
                <LogoutBtn className="w-full" />
              </>
            ) : (
              <div className="flex gap-2 items-center">
                <Button
                  type="button"
                  isLarge={true}
                  isGradientBg={true}
                  className="rounded-md"
                  onClick={() =>
                    navigate("/auth/login", {
                      state: { redirectPath: location.pathname },
                    })
                  }
                >
                  Login
                </Button>
                <Button
                  type="button"
                  isLarge={true}
                  className="rounded-md bg-slate-100 dark:bg-[#202020] text-violet-600 dark:text-white border-violet-500  dark:border-gray-600"
                  onClick={() =>
                    navigate("/auth/signup", {
                      state: { redirectPath: location.pathname },
                    })
                  }
                >
                  Signup
                </Button>
              </div>
            )}
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
