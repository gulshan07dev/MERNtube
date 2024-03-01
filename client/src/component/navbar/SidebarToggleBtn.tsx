import { useDispatch } from "react-redux";
import { Menu } from "@mui/icons-material";
import { twMerge } from "tailwind-merge";

import { onToggle } from "@/store/slices/sidebarSlice";

export default function SidebarToggleBtn({
  className = "",
}: {
  className?: string;
}) {
  const dispatch = useDispatch();
  return (
    <button
      className={twMerge(
        "text-2xl text-gray-500 dark:text-white font-[100] w-10 h-10 grid place-items-center rounded-full bg-slate-100 dark:bg-[#121212] hover:bg-[#f8f8f8] dark:hover:bg-[#131313]",
        className
      )}
      onClick={() => dispatch(onToggle())}
    >
      <Menu />
    </button>
  );
}
