import React from "react";
import { AiOutlineFileUnknown } from "react-icons/ai";

import ErrorDialog from "./ErrorDialog";

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
    <ErrorDialog
      errorMessage={message}
      icon={<AiOutlineFileUnknown className="text-blue-500" />}
      buttonLabel={buttonText}
      buttonOnClick={onRefresh}
    />
  );
};

export default EmptyMessage;
