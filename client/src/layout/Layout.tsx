import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { ScrollRestoration } from "react-router-dom";

import Navbar from "../component/navbar/Navbar";
import Sidebar from "../component/sidebar/Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  byDefaultSidebarHidden?: boolean;
  showNavigation?: boolean;
}

export function scrollToTop() {
  window.scroll({ top: 0, behavior: "smooth" });
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className = "",
  byDefaultSidebarHidden = false,
  showNavigation = true,
}) => {
  useEffect(() => {
    window.addEventListener("load", scrollToTop);
    return () => {
      window.removeEventListener("load", scrollToTop);
    };
  }, []);

  return (
    <>
      {showNavigation && (
        <Navbar showSidebarToggleBtn={byDefaultSidebarHidden} />
      )}
      <main
        className="w-full min-h-screen bg-white_bg dark:bg-dark_bg relative flex"
        role="region"
        aria-label="Main Content="
      >
        {showNavigation && (
          <section>
            <Sidebar byDefaultSidebarHidden={byDefaultSidebarHidden} />
          </section>
        )}

        <section
          className={twMerge(
            "w-full flex flex-grow",
            "md:px-8 px-3 py-3 max-md:pb-20",
            className
          )}
        >
          <ScrollRestoration />
          {children}
        </section>
      </main>
    </>
  );
};

export default Layout;
