import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import useSidebar from "@/hooks/useSidebar";
import React from "react";

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
  const { onClose } = useSidebar();
  return (
    <NavLink to={`${slug}`} onClick={onClose}>
      {({ isActive }) => (
        <button
          className={twMerge(
            "flex gap-6 items-center font-Noto_sans px-4 py-1.5 rounded-lg w-full",
            isActive ? "bg-[#edf4ff] text-[#000000]" : "text-[#202427]",
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
              isActive ? "text-zinc-950" : "text-zinc-700"
            } ${className}`}
          >
            {label}
          </span>
        </button>
      )}
    </NavLink>
  );
}
