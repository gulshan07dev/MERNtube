import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import { onClose } from "@/store/slices/sidebarSlice";
import { RootState } from "@/store/store";

interface MenuLinkProps {
  label: string;
  icon: React.ReactElement;
  slug: string;
  className?: string;
}

export default function MenuLink({
  label,
  icon,
  slug,
  className,
}: MenuLinkProps) {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state: RootState) => state.sidebar);
  return (
    <NavLink to={`${slug}`} onClick={() => isOpen && dispatch(onClose())}>
      {({ isActive }) => (
        <button
          className={twMerge(
            "flex gap-6 items-center font-Noto_sans px-4 h-10 rounded-lg w-full",
            isActive
              ? "bg-[#edf4ff] hover:bg-[#ddecff] dark:bg-[#272727] hover:dark:bg-[#353535] text-[#000000] dark:text-white"
              : "text-[#202427] dark:text-slate-50 hover:bg-slate-100 dark:hover:bg-[#202020]",
            className
          )}
        >
          <span
            className={`text-xl ${
              isActive ? "stroke-slate-950 " : "stroke-slate-700"
            }`}
          >
            {icon}
          </span>
          <span
            className={`text-[15px] font-roboto font-[500] truncate ${
              isActive
                ? "text-zinc-950 dark:text-white"
                : "text-zinc-700 dark:text-slate-50"
            } ${className}`}
          >
            {label}
          </span>
        </button>
      )}
    </NavLink>
  );
}
