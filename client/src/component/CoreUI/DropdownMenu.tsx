import React, {
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";

import useClickOutside from "@/hooks/useClickOutside";
import { twMerge } from "tailwind-merge";

const DropdownMenu = ({
  triggerButton,
  className,
  children,
}: {
  triggerButton: ReactElement;
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

  const handleDropdownButtonClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    handleToggle()
  }, []);

  useClickOutside({ ref: dropdownRef, callback: handleClose });

  return (
    <div className={twMerge("relative", className)} ref={dropdownRef}>
      {React.cloneElement(triggerButton, {
        onClick: handleDropdownButtonClick,
      })}

      {isOpen && (
        <div
          className="absolute z-[49] right-0 mt-1 transition-opacity
        duration-300 opacity-100 py-5 px-4 bg-white dark:bg-dark_bg shadow-lg border dark:border-[#434343] rounded-md 
        flex flex-col items-start gap-2.5"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
