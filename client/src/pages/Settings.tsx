import Layout from "@/layout/Layout";
import ToggleDarkMode from "@/component/settings/ToggleDarkModeBtn";

const Settings = () => {
  return (
    <Layout className="flex flex-col gap-10 md:px-8 px-2 pt-4">
      <h1 className="text-3xl text-black dark:text-white font-bold font-hedvig_letters">
        Settings
      </h1>
      <div className="flex flex-col gap-4">
        {/* prefrences setting */}
        <div className="py-5 px-3 bg-slate-100 dark:bg-[#171717] rounded">
          <h2 className="text-xl text-gray-800 dark:text-slate-100 font-semibold mb-2">
            Preferences
          </h2>
          <ToggleDarkMode />
          {/* Add more preference settings here */}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
