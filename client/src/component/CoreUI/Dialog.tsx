import React, { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import useClickOutside from "@/hooks/useClickOutside ";
import Button from "./Button";

interface DialogProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  submitLabel?: string;
  onSubmit?: () => void;
  isLoading?: boolean;
  className?: string;
  triggerButton: React.ReactElement;
}

const Dialog: React.FC<DialogProps> = ({
  title,
  description,
  children,
  submitLabel,
  onSubmit,
  isLoading,
  className = "",
  triggerButton,
}) => {
  const [isShowDialog, setIsShowDialog] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const onOpen = () => {
    setIsShowDialog(true);
  };
  const onCancel = () => {
    setIsShowDialog(false);
  };
  useClickOutside({
    ref: dialogRef,
    callback: onCancel,
  });
  return (
    <>
      {React.cloneElement(triggerButton, { onClick: onOpen })}
      {isShowDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            ref={dialogRef}
            className={twMerge(
              "bg-white dark:bg-[#121212] dark:border dark:border-[#434343] rounded-md p-8 max-w-md w-[95%] flex flex-col gap-3",
              className
            )}
          >
            <h2 className="text-xl text-black dark:text-white font-bold font-Noto_sans">
              {title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{description}</p>
            {children && children}
            <div className="flex gap-3 justify-end mt-3">
              <Button
                label="Cancel"
                className="bg-red-500 text-white border-none"
                onClick={onCancel}
                disabled={isLoading}
              />
              <Button
                label={submitLabel || "Okay"}
                onClick={onSubmit}
                disabled={isLoading}
                className="border-none dark:bg-[#333333] dark:border-[#505050] dark:text-white"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dialog;
