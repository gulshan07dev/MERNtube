import { useState } from "react";

import Button from "./CoreUI/Button";
import { twMerge } from "tailwind-merge";

interface TabsProps {
  tabs: { label: string; component: React.ReactElement }[];
  className?: string;
}

const Tabs = ({ tabs, className = "" }: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0].label);

  return (
    <div
      className={twMerge(
        "max-w-[600px] w-[95%] flex flex-col gap-5",
        className
      )}
    >
      <div className="bg-slate-100 dark:bg-[#202020] rounded-lg p-3 flex items-center justify-center">
        {tabs.map((tab) => (
          <Button
            key={tab.label}
            className={`w-1/2 rounded-xl text-base border-none hover:opacity-80 ${
              selectedTab === tab.label
                ? "bg-[#000000cb] dark:bg-[#454545] text-white"
                : "bg-transparent text-black dark:text-white"
            }`}
            onClick={() => setSelectedTab(tab.label)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      {/* Render the selected tab component */}
      {tabs.map(({ label, component }) => (
        <div
          key={label}
          className={twMerge(
            "transition-all",
            selectedTab === label
              ? "block opacity-100 transform translate-y-0"
              : "hidden opacity-0 transform -translate-y-2"
          )}
          style={{ transitionDuration: "0.3s" }}
        >
          {component}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
