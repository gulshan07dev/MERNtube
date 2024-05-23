import React, { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className }) => {
  return (
    <main role="main" className={twMerge("w-full flex flex-grow", className)}>{children}</main>
  );
};

export default PageLayout;
