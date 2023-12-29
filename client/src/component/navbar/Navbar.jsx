import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu } from "@mui/icons-material";

import { navHeight } from "../../constant";
import Logo from "../Logo";
import SearchBar from "./SearchBar";
import useSidebar from "../../hooks/useSidebar";
import Avatar from "../Avatar";
import Button from "../Button";

export default function Navbar() {
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
      <div className="flex md:gap-2 gap-0 items-center">
        <button
          className="md:hidden text-2xl text-gray-500 font-[100] hover:bg-[#f8f8f8]"
          onClick={onToggle}
        >
          <Menu />
        </button>
        <Logo />
      </div>

      <div className="max-sm:hidden">
        <SearchBar />
      </div>

      <div className="flex items-center gap-1">
        {isLoggedIn ? null : ( //TODO
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
        <Avatar url={user?.avatar?.url || ""} fullName={user?.fullName || ""} />
      </div>
    </nav>
  );
}
