import { useState } from "react";

import Layout from "@/layout/Layout";
import ToggleDarkMode from "@/component/settings/ToggleDarkModeBtn";
import SettingsCategory from "@/component/settings/SettingsCategory";
import ToggleWatchHistoryPauseStatus from "@/component/settings/ToggleWatchHistoryPauseStatus";
import ClearWatchHistory from "@/component/settings/ClearWatchHistory";

const Settings = () => {
  const [openCategory, setOpenCategory] = useState("Preferences");

  const handleToggleCategory = (categoryTitle: string) => {
    setOpenCategory(openCategory === categoryTitle ? "" : categoryTitle);
  };

  return (
    <Layout className="flex flex-col gap-10 md:px-8 px-3 pt-4">
      <h1 className="text-3xl text-black dark:text-white font-bold font-hedvig_letters">
        Settings
      </h1>
      <div className="flex flex-col gap-5">
        {/* Preferences setting */}
        <SettingsCategory
          title="Preferences"
          isOpen={openCategory === "Preferences"}
          onToggle={() => handleToggleCategory("Preferences")}
        >
          <ToggleDarkMode />
        </SettingsCategory>

        {/* watch history setting */}
        <SettingsCategory
          title="Watch History"
          isOpen={openCategory === "Watch History"}
          onToggle={() => handleToggleCategory("Watch History")}
        >
          <ClearWatchHistory />
          <ToggleWatchHistoryPauseStatus />
        </SettingsCategory>

        {/* another category for fun */}
        <SettingsCategory
          title="Another Category"
          isOpen={openCategory === "Another Category"}
          onToggle={() => handleToggleCategory("Another Category")}
        >
          <p className="text-gray-700 dark:text-slate-300 font-nunito font-semibold text-lg">
            Thank you 😊
          </p>
        </SettingsCategory>
      </div>
    </Layout>
  );
};

export default Settings;
