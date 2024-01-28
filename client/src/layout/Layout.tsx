import { twMerge } from "tailwind-merge";

import Navbar from "../component/navbar/Navbar";
import Sidebar from "../component/sidebar/Sidebar";
import { navHeight } from "../constant";
import React from "react";

const Layout = React.forwardRef(
  (
    {
      children,
      className,
      showNavigationBar = true,
      showSidebar = true,
    }: {
      children: React.ReactNode;
      className?: string;
      showNavigationBar?: boolean;
      showSidebar?: boolean;
    },
    ref: React.ForwardedRef<HTMLDivElement>
  ) => {
    return showNavigationBar ? (
      <>
        <Navbar showSidebarToggleBtn={!showSidebar} />
        <div
          style={{ height: `calc(100vh - ${navHeight})` }}
          className="w-full bg-white relative flex overflow-y-scroll"
          role="region"
          aria-label="Main Content"
          ref={ref}
        >
          <Sidebar isHidden={!showSidebar} />
          <main className="w-full flex-1 flex-grow" role="main">
            <section className={twMerge("w-full min-h-full", className)}>
              {children}
            </section>
          </main>
        </div>
      </>
    ) : (
      <main role="main" className="w-full">
        <section className={twMerge("w-full min-h-screen", className)}>
          {children}
        </section>
      </main>
    );
  }
);

export default Layout