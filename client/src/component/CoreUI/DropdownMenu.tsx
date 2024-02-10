import { ReactElement, ReactNode, useRef, useState } from "react";

import useClickOutside from "@/hooks/useClickOutside ";
import { twMerge } from "tailwind-merge";

const DropdownMenu = ({
  button,
  className,
  children,
}: {
  button: ReactElement;
  className?: string;
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useClickOutside({ ref: dropdownRef, callback: handleClose });

  return (
    <div className={twMerge("relative", className)} ref={dropdownRef}>
      <div onClick={handleToggle} className="cursor-pointer">
        {button}
      </div>
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 transition-opacity
        duration-300 opacity-100 py-5 px-4 bg-white shadow-md border rounded-md 
        flex flex-col items-start gap-2.5"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
