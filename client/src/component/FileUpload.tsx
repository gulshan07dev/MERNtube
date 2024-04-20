import React, {
  useState,
  ChangeEvent,
  ForwardedRef,
  RefObject,
  useEffect,
} from "react";
import { twMerge } from "tailwind-merge";

import Input from "./CoreUI/Input";

interface FileUploadProps {
  label: string;
  icon?: React.ReactNode;
  defaultImageSrc?: string;
  onChange?: (file: File | null) => void;
  accept?: string;
  className?: string;
  disabled?: boolean;
  fileType?: "image" | "video";
}

const FileUpload = React.forwardRef(
  (
    {
      label,
      icon,
      defaultImageSrc,
      onChange = () => {},
      accept = "",
      className = "",
      disabled,
      fileType = "image",
    }: FileUploadProps,
    ref: RefObject<HTMLInputElement> | ForwardedRef<HTMLInputElement> | any
  ) => {
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null;

      if (selectedFile) {
        setFilePreview(URL.createObjectURL(selectedFile));
      }

      onChange(selectedFile);
    };

    useEffect(() => {
      if (!ref.current?.value) {
        setFilePreview(null);
      }
    }, [ref.current?.value]);

    return (
      <div
        className={twMerge(
          "w-full rounded-md object-cover overflow-hidden border-2 border-gray-200",
          className
        )}
      >
        <div
          className="flex items-center justify-center h-full w-full cursor-pointer overflow-hidden"
          role="button"
          title={label}
          onClick={() => !disabled && ref?.current?.click()}
        >
          {filePreview ? (
            fileType === "video" ? (
              <video
                src={filePreview}
                controls
                className="h-full object-cover rounded-md"
              />
            ) : (
              <img
                src={filePreview}
                alt="file-preview"
                className="w-full h-full object-cover rounded-md"
              />
            )
          ) : (
            <div className="h-full w-full flex flex-col gap-2 justify-center items-center">
              {icon && label ? (
                <>
                  <span className="text-gray-600 text-4xl">{icon}</span>
                  <span className="text-lg text-gray-700 font-roboto">
                    {label}
                  </span>
                </>
              ) : (
                <img
                  src={defaultImageSrc}
                  className="w-full h-full object-cover rounded-md"
                  alt="default-image"
                />
              )}
            </div>
          )}
        </div>
        <Input
          label={label}
          type="file"
          onChange={handleFileChange}
          accept={accept}
          hidden={true}
          ref={ref}
        />
      </div>
    );
  }
);

export default FileUpload;
