interface ToggleButtonProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const ToggleButton = ({ value, onChange }: ToggleButtonProps) => {
  const handleClick = () => {
    const newValue = !value;
    onChange(newValue);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-14 h-5 flex items-center relative rounded-full ${
        value ? "bg-gray-800" : "bg-gray-200"
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full absolute transition-[right_left] duration-700 ${
          value ? "bg-white right-1" : "bg-gray-500 left-1"
        }`}
      ></div>
    </button>
  );
};

export default ToggleButton;
