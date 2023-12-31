import { Menu } from "@mui/icons-material";
import { twMerge } from "tailwind-merge";

import useSidebar from "@/hooks/useSidebar";

export default function SidebarToggleBtn({ className = "" }) {
  const { onToggle } = useSidebar();
  return (
    <button
      className={twMerge(
        "text-2xl text-gray-500 font-[100] w-10 h-10 grid place-items-center rounded-full bg-slate-100 hover:bg-[#f8f8f8",
        className
      )}
      onClick={onToggle}
    >
      <Menu />
    </button>
  );
}
