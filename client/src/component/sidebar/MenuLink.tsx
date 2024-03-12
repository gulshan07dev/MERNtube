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
  isLabelHiddenClassName: string;
  className?: string;
}

export default function MenuLink({
  label,
  icon,
  slug,
  isLabelHiddenClassName,
  className,
}: MenuLinkProps) {
  const dispatch = useDispatch();
  const { isOpenInMobile } = useSelector((state: RootState) => state.sidebar);
  return (
    <NavLink
      to={`${slug}`}
      onClick={() => isOpenInMobile && dispatch(onClose())}
    >
      {({ isActive }) => (
        <button
          className={twMerge(
            "flex gap-6 items-center font-Noto_sans px-4 py-1.5 rounded-lg w-full",
            isActive
              ? "bg-[#edf4ff] dark:bg-[#272727] text-[#000000] dark:text-white"
              : "text-[#202427] dark:text-slate-50",
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
            } ${className} max-md:block ${isLabelHiddenClassName}`}
          >
            {label}
          </span>
        </button>
      )}
    </NavLink>
  );
}
