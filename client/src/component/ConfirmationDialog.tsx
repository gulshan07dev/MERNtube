import React, { useRef } from "react";
import Button from "./CoreUI/Button";
import useClickOutside from "@/hooks/useClickOutside ";

interface ConfirmationDialogProps {
  title: string;
  description: string;
  submitLabel: string;
  isLoading: boolean;
  isShowDialog: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  triggerButton: React.ReactNode;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  description,
  submitLabel,
  isLoading,
  isShowDialog,
  onCancel,
  onSubmit,
  triggerButton,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  useClickOutside({
    ref: dialogRef,
    callback: onCancel,
  });
  return (
    <>
      {triggerButton}
      {isShowDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
          draggable
            ref={dialogRef}
            className="bg-white dark:bg-[#121212] dark:border dark:border-[#434343] rounded-md p-8 max-w-md w-[95%] flex flex-col gap-2"
          >
            <h2 className="text-xl text-black dark:text-white font-bold font-Noto_sans">
              {title}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{description}</p>
            <div className="flex gap-3 justify-end mt-3">
              <Button
                label="Cancel"
                className="bg-red-500 text-white border-none"
                onClick={onCancel}
                disabled={isLoading}
              />
              <Button
                label={submitLabel}
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

export default ConfirmationDialog;
