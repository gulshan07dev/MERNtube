import { useEffect, useState } from "react";

const ToggleDarkMode = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme")
    const isDarkMode = theme && theme === "dark" 
    if (isDarkMode) {
      setDarkMode(true)
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
      <button
        onClick={toggleDarkMode}
        className={`w-14 h-5 flex items-center relative rounded-full ${
          darkMode ? "bg-gray-800" : "bg-gray-200"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full absolute ${
            darkMode ? "bg-white right-1" : "bg-gray-500 left-1"
          }`}
        ></div>
      </button>
    </div>
  );
};

export default ToggleDarkMode;
