import { useDispatch, useSelector } from "react-redux";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { twMerge } from "tailwind-merge";

import { onOpen, onClose } from "@/store/slices/sidebarSlice";
import { AppDispatch, RootState } from "@/store/store";

export default function SidebarToggleBtn({
  className = "",
}: {
  className?: string;
}) {
  const dispatch: AppDispatch = useDispatch();
  const { isOpen } = useSelector((state: RootState) => state.sidebar);

  const onSidebarToggle = () => {
    isOpen ? dispatch(onClose()) : dispatch(onOpen());
  };
  return (
    <button
      title={isOpen ? "Close sidebar" : "Open sidebar"}
      className={twMerge(
        "text-2xl text-gray-500 dark:text-white font-[100] w-10 h-10 grid place-items-center rounded-full bg-slate-100 dark:bg-[#121212] hover:bg-[#f8f8f8] dark:hover:bg-[#131313]",
        className
      )}
      onClick={onSidebarToggle}
    >
      <IoClose
        className={twMerge(
          isOpen ? ["block opacity-95"] : ["hidden opacity-0"],
          "transition-[display_opacity] delay-500"
        )}
      />
      <HiMenuAlt2
        className={twMerge(
          isOpen ? ["hidden opacity-0"] : ["block opacity-100"],
          "transition-[display_opacity] delay-500"
        )}
      />
    </button>
  );
}
