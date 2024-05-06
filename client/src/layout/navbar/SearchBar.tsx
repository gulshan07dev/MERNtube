import { FaSearch } from "react-icons/fa";
import { Search } from "@mui/icons-material";

export default function SearchBar() {
  return (
    <div className="group md:w-[550px] w-[300px] transition-all group border border-gray-300 dark:border-gray-700 rounded-full bg-[#f8f8f8] dark:bg-[#121212] relative overflow-hidden flex justify-between items-center">
      <div className="flex flex-grow items-center gap-3 bg-white dark:bg-dark_bg rounded-ss-full rounded-es-full border border-e-gray-300  dark:border-e-gray-700 focus-within:border-blue-600 dark:focus-within:border-blue-500 dark:border-transparent pl-3">
        <FaSearch
          size={15}
          className="text-gray-400 font-extralight hidden group-focus-within:block"
        />
        <input
          type="text"
          placeholder="search"
          className="peer text-lg text-gray-800 dark:text-white py-1 flex-grow font-nunito_sans bg-transparent border-none"
        />
      </div>
      <button className="rounded-se-full rounded-ee-full cursor-pointer px-4 py-1 text-sm text-gray-600 dark:text-slate-100 dark:hover:text-slate-300">
        <Search />
      </button>
    </div>
  );
}
