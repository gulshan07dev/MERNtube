import { ForwardedRef, useEffect } from "react";

const useClickOutside = ({
  ref,
  callback,
}: {
  ref: ForwardedRef<HTMLElement> | any;
  callback: () => void;
}) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (event && ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
     document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
       document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [ref, callback]);
};

export default useClickOutside; 