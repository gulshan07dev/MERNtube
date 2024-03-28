import SettingsCategory from "../SettingsCategory";
import ClearWatchHistory from "./ClearWatchHistory";
import ToggleWatchHistoryPauseStatus from "./ToggleWatchHistoryPauseStatus";

export default function WatchHistorySettings() {
  return (
    <SettingsCategory title="Watch History">
      <ClearWatchHistory />
      <ToggleWatchHistoryPauseStatus />
    </SettingsCategory>
  );
}
