import { useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { navHeight } from "@/constant";
import Logo from "../CoreUI/Logo";
import SearchBar from "./SearchBar";
import Avatar from "../CoreUI/Avatar";
import Button from "../CoreUI/Button";
import DropdownMenu from "../CoreUI/DropdownMenu";
import LogoutBtn from "./LogoutBtn";
import SidebarToggleBtn from "./SidebarToggleBtn";

import type { RootState } from "@/store/store";
import Skeleton from "../Skeleton";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: appLoading } = useSelector(
    (state: RootState) => state.appLoading
  );
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  return (
    <nav
      className={`w-full bg-white dark:bg-dark_bg flex justify-between items-center md:px-7 md:pl-4 px-3`}
      style={{ height: navHeight }}
      role="navigation"
      aria-label="Primary Navigation"
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <SidebarToggleBtn />
        <Logo />
      </div>

      {/* Center Section */}
      <div className="max-sm:hidden">
        <SearchBar />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        {/* Display user information or login/signup buttons */}
        {isLoggedIn ? (
          // If user is logged in, show user Dropdown menu
          appLoading ? (
            <Skeleton className="w-10 h-10 rounded-full" />
          ) : (
            <DropdownMenu
              triggerButton={
                <Avatar
                  url={user?.avatar?.url || ""}
                  fullName={user?.fullName || ""}
                />
              }
            >
              {/* User Information */}
              <div className="flex gap-3">
                <Avatar
                  url={user?.avatar?.url || ""}
                  fullName={user?.fullName || ""}
                />
                <div className="flex flex-col min-w-[120px] max-w-[165px]">
                  <h1 className="text-base text-gray-900 dark:text-white font-roboto truncate">
                    {user?.fullName}
                  </h1>
                  <p className="text-sm text-gray-700 dark:text-[#AAAAAA] font-nunito leading-none truncate">
                    {user?.username}
                  </p>
                  {/* Link to user's channel */}
                  <Link
                    to="/channel"
                    className="text-[12px] text-blue-600 dark:text-blue-500 font-[600] font-nunito_sans leading-5"
                  >
                    View your channel
                  </Link>
                </div>
              </div>
              {/* Dropdown Menu Options */}
              <Link to="/account" className="text-gray-700 dark:text-slate-300">
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
            </DropdownMenu>
          )
        ) : // If user is not logged in, show login/signup buttons
        appLoading ? (
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <Button
              type="button"
              isLarge={false}
              isGradientBg={true}
              className="h-8 w-16 rounded-md"
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
              isLarge={false}
              className="h-10 w-16 rounded-md bg-slate-50 dark:bg-[#202020] text-violet-600 dark:text-white border-slate-300  dark:border-gray-600"
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
      </div>
    </nav>
  );
};

export default Navbar;
