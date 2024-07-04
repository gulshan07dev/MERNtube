import PageLayout from "@/layouts/PageLayout";
import SettingsCategory from "@/components/settings/SettingsCategory";
import PreferencesSettings from "@/components/settings/preferences/PreferencesSettings";
import WatchHistorySettings from "@/components/settings/watchHistory/WatchHistorySettings";

const Settings = () => {
  return (
    <PageLayout className="flex flex-col gap-10">
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
    </PageLayout>
  );
};

export default Settings;
