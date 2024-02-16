import React from "react";
import { twMerge } from "tailwind-merge";

import Navbar from "../component/navbar/Navbar";
import Sidebar from "../component/sidebar/Sidebar";
import { navHeight } from "../constant";
import OfflineDetector from "@/component/OfflineDetector";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  showNavigationBar?: boolean;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  showNavigationBar = true,
  showSidebar = true,
}) => {
  return showNavigationBar ? (
    <>
      <Navbar showSidebarToggleBtn={!showSidebar} />
      <div
        style={{ height: `calc(100vh - ${navHeight})` }}
        className="w-full bg-white dark:bg-dark_bg relative flex overflow-y-scroll"
        role="region"
        aria-label="Main Content"
        id="main-container"
      >
        <Sidebar isHidden={!showSidebar} />
        <main className="w-full flex-1 flex-grow" role="main">
          <section className={twMerge("w-full min-h-full flex", className)}>
            <OfflineDetector>{children}</OfflineDetector>
          </section>
        </main>
      </div>
    </>
  ) : (
    <main role="main" className="w-full bg-white dark:bg-dark_bg" id="main-container">
      <section className={twMerge("w-full min-h-screen flex", className)}>
        <OfflineDetector>{children}</OfflineDetector>
      </section>
    </main>
  );
};

export default Layout;
