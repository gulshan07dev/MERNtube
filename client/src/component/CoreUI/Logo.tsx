import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={twMerge("block md:w-[170px] w-[130px] dark:invert", className)}>
      <img src="/logo.png" alt="Logo" />
    </Link>
  );
}
