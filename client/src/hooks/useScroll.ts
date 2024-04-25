import { useEffect } from "react";

const useScroll = (onScrollDown: () => void, onScrollUp: () => void) => {
  useEffect(() => {
    let prevScrollPosition = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollPosition = window.pageYOffset;
      if (prevScrollPosition < currentScrollPosition) {
        // Scrolling down
        onScrollDown();
      } else {
        // Scrolling up
        onScrollUp();
      }
      prevScrollPosition = currentScrollPosition;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [onScrollDown, onScrollUp]);
};

export default useScroll;
