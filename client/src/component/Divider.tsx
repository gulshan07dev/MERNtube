import { twMerge } from "tailwind-merge";

export default function Devider({
  type = "horizontal",
  className = "",
}: {
  type?: "horizontal" | "vertical";
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "bg-[#00000015] m-1",
        type === "horizontal" ? ["w-full h-[1.5px]"] : ["w-[1.5px] h-full"],
        className
      )}
    ></div>
  );
}
