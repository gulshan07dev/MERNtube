import { twMerge } from "tailwind-merge";

export default function Button({
  label,
  isLarge = true,
  onClick = () => {},
  className = "selection:",
  ...props
}) {
  return (
    <button
      className={twMerge(
        "rounded-[4px] border border-[#ff12f3] bg-[#ff1cf4] hover:opacity-60 transition-[background] text-white font-medium font-Noto_sans disabled:opacity-60",
        isLarge ? ["px-4 py-2 text-base"] : ["px-3 py-1.5 text-sm"],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  );
}
