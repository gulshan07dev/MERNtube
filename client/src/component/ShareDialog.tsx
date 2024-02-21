import { ReactElement, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaWhatsapp,
  FaCopy,
  FaShare,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import Dialog from "./CoreUI/Dialog";

const ShareDialog = ({
  url,
  triggerButton,
}: {
  url: string;
  triggerButton?: ReactElement;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const shareOptions = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      link: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    },
    {
      name: "LinkedIn",
      icon: FaLinkedinIn,
      link: `https://www.linkedin.com/shareArticle?mini=true&url=${url}`,
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      link: `https://api.whatsapp.com/send?text=${url}`,
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      link: `https://twitter.com/intent/tweet?url=${url}`,
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      inputRef?.current?.select();
      toast.success("Link copied to clipboard!");
    });
  };

  const scrollLeftHandler = () => {
    const container = document.getElementById("share-icons-container");
    if (container) {
      container.scrollLeft -= 200;
      setScrollLeft(container.scrollLeft);
    }
  };

  const scrollRightHandler = () => {
    const container = document.getElementById("share-icons-container");
    if (container) {
      container.scrollLeft += 200;
      setScrollLeft(container.scrollLeft);
    }
  };

  return (
    <Dialog
      title="Share"
      description="share your video"
      triggerButton={
        triggerButton ? (
          triggerButton
        ) : (
          <button className="size-10 rounded-full grid place-items-center bg-slate-200 text-lg text-zinc-800 dark:text-white hover:bg-slate-300 dark:bg-[#272727] dark:hover:bg-[474747]">
            <FaShare />
          </button>
        )
      }
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full">
          <div
            id="share-icons-container"
            className="w-full flex gap-4 px-4 overflow-x-scroll no-scrollbar transition-all"
          >
            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 text-black dark:text-white bg-gray-200 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <option.icon className="text-xl" />
                <span>{option.name}</span>
              </a>
            ))}
          </div>
          <button
            onClick={scrollLeftHandler}
            className="absolute -left-8 top-0 size-10 grid place-items-center text-base text-black dark:text-white bg-white shadow-lg dark:bg-[#212121] rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={scrollRightHandler}
            className="absolute -right-8 top-0 size-10 grid place-items-center text-base text-black dark:text-white bg-white shadow-lg dark:bg-[#212121] rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <FaArrowRight />
          </button>
        </div>
        <div className="w-full border border-gray-300 p-2 bg-transparent dark:border-[#212121] dark:bg-black flex gap-3">
          <input
            type="text"
            value={url}
            readOnly
            ref={inputRef}
            className="flex-grow bg-transparent text-black dark:text-white text-sm font-roboto"
          />

          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center space-x-2 text-black dark:text-white bg-gray-100 dark:bg-gray-800 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 dark:border-[#373737] transition col-span-2"
          >
            <FaCopy className="text-xl" />
            <span>Copy</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ShareDialog;
