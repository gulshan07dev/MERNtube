import React, { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { AiOutlineClose } from "react-icons/ai";
import { createPortal } from "react-dom";

import useClickOutside from "@/hooks/useClickOutside";
import Button from "./Button";

interface ModalProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  submitLabel?: string;
  onSubmit?: () => void;
  isLoading?: boolean;
  className?: string;
  triggerButton: React.ReactElement;
  closeButton?: React.ReactElement;
  onOpen?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  title,
  description,
  children,
  submitLabel,
  onSubmit,
  isLoading,
  className = "",
  triggerButton,
  closeButton,
  onOpen,
}) => {
  const [isShowModal, setIsShowModal] = useState(false);
  const ModalRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => {
    setIsShowModal(true);
    if (onOpen) {
      onOpen();
    }
  };

  const handleClose = () => {
    setIsShowModal(false);
  };

  useClickOutside({
    ref: ModalRef,
    callback: handleClose,
  });

  return (
    <>
      {React.cloneElement(triggerButton, { onClick: handleOpen })}
      {isShowModal &&
        createPortal(
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-70">
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
              <div className="flex gap-3 justify-end mt-3">
                <button
                  className="p-2 rounded-full text-2xl text-black dark:text-white absolute top-4 right-1 bg-red-50 hover:bg-red-500 hover:text-white dark:bg-[#242424] dark:hover:bg-[#505050] transition-[color_background]"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  <AiOutlineClose />
                </button>
                <div className="flex gap-3">
                  {closeButton &&
                    React.cloneElement(closeButton, { onClick: handleClose })}
                </div>
                {submitLabel && onSubmit && (
                  <Button
                    onClick={onSubmit}
                    disabled={isLoading}
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
