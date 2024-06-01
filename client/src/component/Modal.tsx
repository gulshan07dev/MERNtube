import React, { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { AiOutlineClose } from "react-icons/ai";
import { createPortal } from "react-dom";

import useClickOutside from "@/hooks/useClickOutside";
import Button from "./CoreUI/Button";

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  description: string;
  children?: React.ReactNode;
  submitLabel?: string;
  onSubmit?: () => void;
  isSubmitButtonDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
  onOpen?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  open,
  handleClose,
  title,
  description,
  children,
  submitLabel,
  onSubmit,
  isSubmitButtonDisabled,
  isLoading,
  className = "",
  onOpen,
}) => {
  const ModalRef = useRef<HTMLDivElement>(null);

  if (!submitLabel) {
    useClickOutside({
      ref: ModalRef,
      callback: () => {
        if (!isLoading) {
          handleClose();
        }
      },
    });
  }

  useEffect(() => {
    if (onOpen && open) onOpen();
    return;
  }, [open]);

  return (
    <>
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-15 backdrop-blur-[3px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={ModalRef}
              className={twMerge(
                "relative bg-white dark:bg-[#121212] dark:border dark:border-[#525252] rounded-md max-w-md w-[95%] max-h-[95%] overflow-x-hidden overflow-y-auto on-scrollbar flex flex-col",
                className
              )}
            >
              <div className="flex flex-col gap-4 max-sm:px-4 p-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl text-black dark:text-white font-bold font-Noto_sans">
                    {title}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {description}
                  </p>
                </div>
                {children && <div>{children}</div>}
              </div>

              <div
                className={twMerge(
                  submitLabel && [
                    "w-full flex gap-4 justify-between pt-3 pb-5 sm:px-5 px-4 border-t-[0.5px] border-slate-200 dark:border-[#525252] bg-purple-50 dark:bg-[#172227]",
                  ]
                )}
              >
                {!submitLabel ? (
                  <button
                    className="p-2 rounded-full text-2xl text-black dark:text-white absolute top-4 right-1 bg-red-50 hover:bg-red-500 hover:text-white dark:bg-[#242424] dark:hover:bg-[#505050] transition-[color_background]"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    <AiOutlineClose />
                  </button>
                ) : (
                  <Button
                    className="px-5 bg-red-500 border border-red-600 rounded-md"
                    disabled={isLoading}
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                )}

                {submitLabel && onSubmit && (
                  <Button
                    onClick={onSubmit}
                    disabled={isLoading || isSubmitButtonDisabled}
                    isGradientBg={true}
                    className="dark:text-white  rounded-md"
                  >
                    {submitLabel}
                  </Button>
                )}
              </div>
            </div>
          </div>,
          document.getElementById("portal") as HTMLElement
        )}
    </>
  );
};

export default Modal;
