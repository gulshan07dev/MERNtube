import React from "react";

export default function Button({
  label,
  isLarge = true,
  onClick = () => {},
  className = "selection:",
  ...props
}) {
  return (
    <button
      className={`${className} rounded-[4px] border border-[#ff12f3] bg-[#ff1cf4] hover:opacity-60
       transition-[background] text-white font-medium font-Noto_sans
       disabled:opacity-60 ${
         isLarge ? "px-4 py-2 text-lg" : "px-3 py-1.5 text-sm"
       }`}
       onClick={onClick}
      {...props}
    >
      {label}
    </button>
  );
}
