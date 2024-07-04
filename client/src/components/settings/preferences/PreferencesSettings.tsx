import SettingsCategory from "../SettingsCategory";
import ToggleDarkMode from "./ToggleDarkModeBtn";

export default function PreferencesSettings() {
  return (
    <SettingsCategory title="Preferences">
      <ToggleDarkMode />
    </SettingsCategory>
  );
}
