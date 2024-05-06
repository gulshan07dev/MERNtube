import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Outlet, ScrollRestoration } from "react-router-dom";

import Navbar from "./navbar/Navbar";
import Sidebar from "./sidebar/Sidebar";

interface RootLayoutProps {
  byDefaultSidebarHidden?: boolean;
  showNavigation?: boolean;
}

export function scrollToTop() {
  window.scroll({ top: 0, behavior: "smooth" });
}

const RootLayout: React.FC<RootLayoutProps> = ({
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
            "md:px-8 px-3 py-3 max-md:pb-20"
          )}
        >
          <ScrollRestoration />
          <Outlet />
        </section>
      </main>
    </>
  );
};

export default RootLayout;
