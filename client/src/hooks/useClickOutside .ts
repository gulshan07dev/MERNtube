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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

export default useClickOutside;
