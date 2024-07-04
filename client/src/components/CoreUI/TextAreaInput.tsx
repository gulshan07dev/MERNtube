import React, {
  useState,
  TextareaHTMLAttributes,
  ChangeEvent,
  ForwardedRef,
} from "react";
import { twMerge } from "tailwind-merge";

interface TextAreaInputProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  rows?: number;
  cols?: number;
  value: any;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isOptional?: boolean;
  maxTextSize?: number;
}

const TextAreaInput = React.forwardRef(
  (
    {
      label,
      rows,
      cols,
      value,
      onChange = () => {},
      isOptional = false,
      maxTextSize,
      ...props
    }: TextAreaInputProps,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const [characterCount, setCharacterCount] = useState(
      value ? value.length : 0
    );

    return (
      <div className="relative w-full">
        <textarea
          className={twMerge(
            "peer w-full h-full bg-transparent text-blue-gray-700 dark:text-slate-200 font-poppins font-normal outline outline-0 focus:outline-0 disabled:opacity-60 border-2 border-gray-200 dark:border-gray-600 focus:border-t-0 border-t-0 placeholder-shown:border-t-2 text-[17px] text-gray-700 px-3 py-3.5 rounded-sm focus:border-gray-900 dark:focus:border-white",
            maxTextSize && "pb-6 resize-none"
          )}
          rows={rows}
          cols={cols}
          title={label}
          name={label}
          value={value}
          maxLength={maxTextSize}
          onChange={(e) => {
            setCharacterCount(e.target.value.length);
            onChange(e);
          }}
          ref={ref}
          {...props}
          placeholder=" "
        />
        {maxTextSize && (
          <div className="text-gray-700 dark:text-slate-400 text-[15px] select-none absolute bottom-1 right-0 mr-3 mb-1">
            {characterCount}/{maxTextSize}
          </div>
        )}
        <label className="flex items-start gap-2 w-full h-full select-none pointer-events-none absolute left-0 font-roboto font-normal !overflow-visible truncate peer-placeholder-shown:text-gray-500 dark:peer-placeholder-shown:text-slate-300 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-500 -top-1.5 peer-placeholder-shown:text-lg text-[15px] peer-focus:text-[15px] transition-all before:content[' '] before:block before:box-border before:w-2.5 before:h-2 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:border-t-2 peer-focus:before:border-t-2 peer-focus:before:border-l-2 before:pointer-events-none  peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-2 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:border-t-2 peer-focus:after:border-t-2 peer-focus:after:border-r-2 after:pointer-events-none peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 dark:text-slate-300 peer-focus:text-gray-900 dark:peer-focus:text-white before:border-gray-200 dark:before:border-gray-600 peer-focus:before:!border-gray-900 dark:peer-focus:before:!border-white after:border-gray-200 dark:after:border-gray-600 peer-focus:after:!border-gray-900 dark:peer-focus:after:!border-white">
          {label}{" "}
          {isOptional && (
            <span className="text-violet-800 dark:text-violet-400 font-nunito_sans">(Optional)</span>
          )}
        </label>
      </div>
    );
  }
);

export default TextAreaInput;
