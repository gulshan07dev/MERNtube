import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { Search } from "@mui/icons-material";
import { twMerge } from "tailwind-merge";
import { MdOutlineCancel } from "react-icons/md";

import Button from "../../component/CoreUI/Button";

export default function SearchBar() {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearchbarOpenInMobile, setIsSearchbarOpenInMobile] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchInputRef.current?.value) {
      return;
    }
    navigate(`/search?query=${searchInputRef.current?.value}`);
    searchInputRef.current.blur()
  };

  return (
    <>
      <div
        className={twMerge(
          "lg:w-[45%] md:w-[40%] max-md:hidden",
          isSearchbarOpenInMobile && [
            "max-md:flex max-md:gap-4 max-md:bg-transparent max-md:bg-white max-md:dark:bg-dark_bg pt-2 pb-3 px-2 max-md:fixed max-md:w-screen max-md:left-0 max-md:top-0 max-md:z-[100]",
          ]
        )}
      >
        {/* search input and submit button */}
        <form
          onSubmit={handleSubmit}
          className={twMerge(
            "group md:w-full flex-grow transition-all border border-gray-300 dark:border-gray-700 max-md:focus-within:border-blue-600 max-md:dark:focus-within:border-blue-500 rounded-full bg-[#f8f8f8] dark:bg-[#272727] relative overflow-hidden flex justify-between items-center"
          )}
        >
          <div className="flex flex-grow items-center gap-3 bg-white dark:bg-dark_bg rounded-ss-full rounded-es-full border border-e-gray-300 dark:border-e-gray-700 md:focus-within:border-blue-600 md:dark:focus-within:border-blue-500 dark:border-transparent pl-3">
            <FaSearch
              size={15}
              className="text-gray-400 font-extralight hidden group-focus-within:block"
            />
            <input
              type="text"
              placeholder="search"
              ref={searchInputRef}
              defaultValue={
                searchInputRef.current?.value ||
                (new URLSearchParams(location.search).get("query") as string)
              }
              className="peer text-lg text-gray-800 dark:text-white py-1 flex-grow font-nunito_sans bg-transparent border-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-se-full rounded-ee-full cursor-pointer max-md:hidden md:px-4 px-2.5 py-1 text-gray-600 dark:text-slate-100 dark:hover:text-slate-300"
          >
            <Search className="md:text-sm text-[10px]" />
          </button>
        </form>

        {isSearchbarOpenInMobile && (
          // for mobile devices. close search input button
          <Button
            btnType="icon-btn"
            className="md:hidden bg-red-50 hover:bg-slate-200 dark:bg-[#303030] hover:dark:bg-[#474747] text-2xl text-red-500 p-1.5"
            onClick={() => setIsSearchbarOpenInMobile(false)}
          >
            <MdOutlineCancel />
          </Button>
        )}
      </div>

      {/* for mobile devices. open search input button */}
      <div className="hidden max-md:flex flex-grow justify-end pr-3 bg-none">
        <Button
          btnType="icon-btn"
          className="bg-slate-100 hover:bg-slate-200 dark:bg-[#303030] hover:dark:bg-[#474747]"
          onClick={() => {
            setIsSearchbarOpenInMobile((prev) => !prev);
            setTimeout(() => {
              if (searchInputRef.current) {
                searchInputRef.current.focus();
              }
            }, 0);
          }}
        >
          <Search />
        </Button>
      </div>
    </>
  );
}
