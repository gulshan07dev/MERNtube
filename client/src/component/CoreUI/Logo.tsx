import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={twMerge("flex items-center gap-0.5", className)}>
      <img src="/merntube-icon.png" alt="Logo" className="size-8" />
      <h2 className="text-black dark:text-slate-200 font-[600] tracking-wider font-nunito">
        MERNtube
      </h2>
    </Link>
  );
}
