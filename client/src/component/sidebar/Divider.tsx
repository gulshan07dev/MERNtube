import { twMerge } from "tailwind-merge";

export default function Devider({ className = "" }: { className?: string }) {
  return (
    <div
      className={twMerge("w-full h-[1.5px] bg-[#00000015] m-1", className)}
    ></div>
  );
}
