import { FiAlertTriangle } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

export default function ErrorMessage({
  errorMessage,
  className="",
}: {
  errorMessage: string;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "w-full flex gap-2 items-center border border-red-600 bg-red-50 shadow-sm rounded-sm p-2",
        className
      )}
    >
      <p className="text-red-600 text-base font-nunito w-full">
        {errorMessage}
      </p>
      <FiAlertTriangle className="text-xl text-red" />
    </div>
  );
}
