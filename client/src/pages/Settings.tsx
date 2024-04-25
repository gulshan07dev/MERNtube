import Layout from "@/layout/Layout";
import SettingsCategory from "@/component/settings/SettingsCategory";
import PreferencesSettings from "@/component/settings/preferences/PreferencesSettings";
import WatchHistorySettings from "@/component/settings/watchHistory/WatchHistorySettings";

const Settings = () => {
  return (
    <Layout className="flex flex-col gap-10">
      <h1 className="text-3xl text-black dark:text-white font-bold font-hedvig_letters">
        Settings
      </h1>
      <div className="flex flex-col gap-5">
        <PreferencesSettings />
        <WatchHistorySettings />

        {/* another setting category for fun */}
        <SettingsCategory title="Another Category">
          <p className="text-gray-700 dark:text-slate-300 font-nunito font-semibold text-lg">
            Thank you 😊
          </p>
        </SettingsCategory>
      </div>
    </Layout>
  );
};

export default Settings;
