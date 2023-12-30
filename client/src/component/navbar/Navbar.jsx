import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Menu } from "@mui/icons-material";

import { navHeight } from "../../constant";
import Logo from "../Logo";
import SearchBar from "./SearchBar";
import useSidebar from "../../hooks/useSidebar";
import Avatar from "../Avatar";
import Button from "../Button";
import DropdownMenu from "../DropdownMenu";

const Navbar = () => {
  const navigate = useNavigate();
  const { onToggle } = useSidebar();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  return (
    <nav
      className={`w-full flex justify-between items-center md:px-7 px-3 sticky top-0 z-50`}
      style={{ height: navHeight }}
      role="navigation"
      aria-label="Primary Navigation"
    >
      {/* Left Section */}
      <div className="flex items-center">
        {/* Toggle Sidebar Button */}
        <button
          className="md:hidden text-2xl text-gray-500 font-[100] w-10 h-10 grid place-items-center rounded-full bg-slate-100 hover:bg-[#f8f8f8]"
          onClick={onToggle}
        >
          <Menu />
        </button> 

        <Logo />
      </div>

      {/* Center Section */}
      <div className="max-sm:hidden">
        {/* Search Bar */}
        <SearchBar />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
        {/* Display user information or login/signup buttons */}
        {isLoggedIn ? (
          // If user is logged in, show user Dropdown menu
          <DropdownMenu
            button={
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
              <div className="flex flex-col max-w-[160px]">
                <h1 className="text-base text-gray-900 font-roboto truncate">
                  {user.fullName}
                </h1>
                <p className="text-sm text-gray-700 font-nunito leading-none truncate">
                  {user.username}
                </p>
                {/* Link to user's channel */}
                <Link
                  to="/channel"
                  className="text-[12px] text-blue-600 font-[600] font-nunito_sans leading-5"
                >
                  View your channel
                </Link>
              </div>
            </div>
            {/* Dropdown Menu Options */}
            <Link to="/profile">Profile</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/setting">Setting</Link>
            <hr />
            {/* logout */}
            <Button
              label="Logout"
              isLarge={false}
              className="bg-red-500 text-sm"
            />
          </DropdownMenu>
        ) : (
          // If user is not logged in, show login/signup buttons
          <div className="flex gap-2 items-center">
            <Button
              label="Login"
              type="button"
              isLarge={false}
              onClick={() => navigate("/auth/login")}
            />
            <Button
              label="Signup"
              type="button"
              isLarge={false}
              className="bg-slate-50 text-violet-600 border-slate-300"
              onClick={() => navigate("/auth/signup")}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
