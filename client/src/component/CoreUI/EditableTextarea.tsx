import { useEffect, useRef, TextareaHTMLAttributes, ChangeEvent } from "react";

interface EditableTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const EditableTextarea = ({ value, onChange }: EditableTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Automatically adjust height to fit content on component mount
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    onChange(e);
  };

  return (
    <textarea
      ref={textareaRef}
      className="text-sm text-gray-800 bg-transparent dark:text-slate-200 font-roboto font-normal outline outline-0 focus:outline-0 disabled:opacity-60 border-2 border-gray-200 dark:border-gray-600  p-2 overflow-hidden resize-none rounded-sm focus:border-gray-900 dark:focus:border-white whitespace-break-spaces"
      value={value}
      style={{ height: "auto" }}
      onChange={handleInputChange}
    />
  );
};

export default EditableTextarea;
