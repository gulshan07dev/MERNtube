import React from "react";
import { RiRefreshLine } from "react-icons/ri";
import { AiOutlineFileUnknown } from "react-icons/ai";

interface EmptyMessageProps {
  message: string;
  onRefresh?: () => void;
  buttonText?: string;
}

const EmptyMessage: React.FC<EmptyMessageProps> = ({
  message,
  onRefresh,
  buttonText = "Refresh",
}) => {
  return (
    <div className="m-auto flex flex-col gap-1 items-center justify-center text-gray-500 space-y-4">
      <span className="text-6xl text-blue-600 dark:text-blue-400">
        <AiOutlineFileUnknown />
      </span>
      <p className="text-4xl text-black dark:text-white font-nunito_sans font-semibold">
        {message}
      </p>
      {onRefresh && (
        <button
          className="flex items-center justify-center mt-3 bg-zinc-500 text-white rounded-md px-4 py-2 text-lg hover:bg-zinc-600 focus:outline-none focus:bg-gray-300"
          onClick={onRefresh}
        >
          <RiRefreshLine className="mr-2" />
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyMessage;
