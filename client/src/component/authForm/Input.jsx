export default function Input({ label, type, value, onChange, ...props }) {
  return (
    <div className="relative w-full">
      <input
        className="peer w-full h-full bg-transparent text-blue-gray-700 font-poppins font-normal transition-all outline outline-0 focus:outline-0 disabled:opacity-60 border-2 border-blue-gray-200 focus:border-t-0 border-t-0 placeholder-shown:border-t-2 text-[17px] text-gray-700 p-3 rounded-sm border-blue-gray-200 focus:border-gray-900"
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        {...props}
      />
      <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-roboto font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-lg text-[14px] peer-focus:text-[14px] before:content[' '] before:block before:box-border before:w-2.5 before:h-2 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:border-t-2 peer-focus:before:border-t-2 peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-2 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:border-t-2 peer-focus:after:border-t-2 peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
        {label}
      </label>
    </div>
  );
}
