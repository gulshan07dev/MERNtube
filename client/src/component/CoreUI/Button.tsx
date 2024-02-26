import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: React.ReactElement;
  isLarge?: Boolean;
  isGradientBg?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  label,
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
        "rounded-[4px] flex gap-2 items-center justify-center border border-[#ff12f3] bg-[#ff1cf4] hover:opacity-60 transition-[background] text-white font-medium font-Noto_sans disabled:opacity-60",
        isLarge ? ["px-4 py-3 text-sm"] : ["px-3 py-1.5 text-[12px]"],
        isGradientBg && [
          "bg-gradient-to-br from-violet-400 via-violet-500 to-violet-600",
        ],
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
