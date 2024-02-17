interface SettingsCategoryProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const SettingsCategory = ({
  title,
  isOpen,
  onToggle,
  children,
}: SettingsCategoryProps) => {
  return (
    <div className="py-5 md:px-5 px-3 flex flex-col gap-4 bg-slate-100 dark:bg-[#171717] rounded">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <h2 className="text-xl text-gray-800 dark:text-slate-100 font-semibold mb-2">
          {title}
        </h2>
        <div className="transform transition-transform text-black dark:text-white">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transform rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export default SettingsCategory;
