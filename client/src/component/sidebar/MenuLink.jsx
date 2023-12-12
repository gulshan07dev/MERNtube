import React from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function MenuLink({ label, icon, slug, className }) {
  const location = useLocation();
  const isActive = location.pathname === slug;
  return (
    <NavLink
      to={slug}
      className={`flex gap-6 items-center font-Noto_sans px-4 py-1.5 rounded-lg ${className} ${
        isActive ? "bg-[#edf4ff] text-[#000000]" : "text-[#202427]"
      }`}
    >
      <span
        className={`text-xl ${
          isActive ? "stroke-slate-950 " : "stroke-slate-700"
        }`}
      >
        {icon}
      </span>
      <span
        className={`text-[15px] font-roboto font-[500] ${
          isActive ? "text-zinc-950" : "text-zinc-700"
        }`}
      >
        {label}
      </span>
    </NavLink>
  );
}
