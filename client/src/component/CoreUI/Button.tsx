import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  btnType?: "simple-btn" | "icon-btn";
  children: ReactNode;
  icon?: React.ReactElement;
  isLarge?: Boolean;
  isGradientBg?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  btnType = "simple-btn",
  children,
  icon,
  isLarge = true,
  isGradientBg = false,
  onClick = () => {},
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        btnType == "simple-btn"
          ? "rounded-[4px] flex gap-2 items-center justify-center border-none bg-[#ff1cf4] hover:opacity-60 transition-[background] text-white font-medium font-Noto_sans disabled:opacity-60"
          : "size-10 flex justify-center items-center text-lg rounded-full text-black dark:text-white hover:bg-slate-100 focus-within:bg-slate-100 dark:hover:bg-[#171717] focus-within:dark:bg-[#171717]",
        btnType == "simple-btn" && isLarge
          ? ["px-4 py-3 text-sm"]
          : ["px-3 py-1.5 text-[12px]"],
        isGradientBg && [
          "bg-gradient-to-br from-violet-400 via-violet-500 to-violet-600",
        ],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
