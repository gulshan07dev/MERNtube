export default function CheckBox({ label, value, onChange = () => {} }) {
  return (
    <div className="w-full flex justify-between items-center border-[2px] border-gray-200 px-3 py-3.5 rounded-sm">
      <label
        htmlFor={label}
        className="font-roboto font-normal text-lg text-gray-500 leading-tight"
      >
        {label}
      </label>
      <input
        type="checkbox"
        id={label}
        className="md:h-7 md:w-7 h-5 w-5 cursor-pointer"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
}
