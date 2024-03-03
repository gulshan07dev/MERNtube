import { useRef } from "react";
import { toast } from "react-hot-toast";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaWhatsapp,
  FaCopy,
} from "react-icons/fa";

import Modal from "./CoreUI/Modal";

const ShareDialog = ({
  url,
  open,
  handleClose,
}: {
  url: string;
  open: boolean;
  handleClose: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const shareOptions = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      link: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    },
    {
      name: "LinkedIn",
      icon: FaLinkedinIn,
      link: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      link: `https://api.whatsapp.com/send?text=${url}`,
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      link: `http://www.twitter.com/share?url=${url}`,
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      inputRef?.current?.select();
      toast.success("Link copied to clipboard!");
    });
  };

  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Share"
      description="share your video"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full">
          <div
            id="share-icons-container"
            className="w-full flex flex-wrap md:gap-x-10 gap-x-5 gap-y-2 md:px-4 justify-center"
          >
            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.link}
                target="_blank"
                rel="noopener noreferrer"
                title={option.name}
                className="flex items-center justify-center text-black dark:text-white bg-slate-200 dark:bg-gray-800 p-4 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                <option.icon className="text-xl" />
              </a>
            ))}
          </div>
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
    </Modal>
  );
};

export default ShareDialog;
