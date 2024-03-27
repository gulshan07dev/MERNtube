interface ToggleButtonProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const ToggleButton = ({
  value,
  onChange,
  disabled = false,
}: ToggleButtonProps) => {
  const handleClick = () => {
    const newValue = !value;
    onChange(newValue);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-14 h-5 flex items-center relative rounded-full ${
        value ? "bg-zinc-300 dark:bg-gray-500" : "bg-gray-300 dark:bg-gray-600"
      }`}
      disabled={disabled}
    >
      <div
        className={`w-7 h-7 rounded-full absolute transition-[right_left] duration-700 ${
          value
            ? "bg-blue-500 dark:bg-white right-0"
            : "bg-gray-400 dark:bg-gray-400 left-0"
        }`}
      ></div>
    </button>
  );
};

export default ToggleButton;
