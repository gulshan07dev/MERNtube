import React, { useEffect, useRef, useState } from "react";

const DropdownMenu = ({ button, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={handleToggle} className="cursor-pointer">
        {button}
      </div>
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 transition-opacity
        duration-300 opacity-100 py-5 px-4 bg-white shadow-md border rounded-md 
        flex flex-col gap-2.5"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
