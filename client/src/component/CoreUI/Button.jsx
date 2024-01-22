import { twMerge } from "tailwind-merge";

export default function Button({
  label,
  icon,
  isLarge = true,
  onClick = () => {},
  className = "",
  ...props
}) {
  return (
    <button
      className={twMerge(
        "rounded-[4px] flex gap-2 items-center justify-center border border-[#ff12f3] bg-[#ff1cf4] hover:opacity-60 transition-[background] text-white font-medium font-Noto_sans disabled:opacity-60",
        isLarge ? ["px-4 py-3 text-sm"] : ["px-3 py-1.5 text-[12px]"],
        className
      )}
      onClick={onClick}
      name={label}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}
