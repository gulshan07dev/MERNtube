import React, { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { AiOutlineClose } from "react-icons/ai";
import { createPortal } from "react-dom";

import useClickOutside from "@/hooks/useClickOutside";
import Button from "./Button";

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
  closeButton?: React.ReactElement;
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
  closeButton,
  onOpen,
}) => {
  const ModalRef = useRef<HTMLDivElement>(null);

  if (!closeButton) {
    useClickOutside({
      ref: ModalRef,
      callback: handleClose,
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
                "relative bg-white dark:bg-[#121212] dark:border dark:border-[#525252] rounded-md p-8 max-sm:px-4 max-w-md w-[95%] max-h-[95%] overflow-x-hidden overflow-y-scroll flex flex-col gap-3",
                className
              )}
            >
              <h2 className="text-xl text-black dark:text-white font-bold font-Noto_sans">
                {title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{description}</p>
              {children && (
                <div className="overflow-y-scroll no-scrollbar">{children}</div>
              )}
              <div className="flex gap-4 justify-end mt-3">
                {!closeButton ? (
                  <button
                    className="p-2 rounded-full text-2xl text-black dark:text-white absolute top-4 right-1 bg-red-50 hover:bg-red-500 hover:text-white dark:bg-[#242424] dark:hover:bg-[#505050] transition-[color_background]"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    <AiOutlineClose />
                  </button>
                ) : (
                  closeButton && (
                    <div className="flex gap-1">
                      {React.cloneElement(closeButton, {
                        onClick: handleClose,
                      })}
                    </div>
                  )
                )}

                {submitLabel && onSubmit && (
                  <Button
                    onClick={onSubmit}
                    disabled={isLoading || isSubmitButtonDisabled}
                    isGradientBg={true}
                    className="border-none dark:text-white"
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
