import { useEffect, useState } from "react";
import ToggleButton from "../CoreUI/ToggleButton";

const ToggleDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const isDarkMode = theme && theme === "dark";
    if (isDarkMode) {
      setDarkMode(true);
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
  }, [darkMode]);

  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg text-gray-700 dark:text-gray-300">Dark Mode</h3>
      <ToggleButton value={darkMode} onChange={toggleDarkMode} />
    </div>
  );
};

export default ToggleDarkMode;
