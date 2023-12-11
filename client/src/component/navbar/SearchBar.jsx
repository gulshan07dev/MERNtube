import React from "react";

import { FaSearch } from "react-icons/fa";
import { Search } from "@mui/icons-material";

export default function SearchBar() {
  return (
    <div className="md:w-[500px] w-[300px] transition-all group border border-gray-300 rounded-full bg-[#f8f8f8] relative overflow-hidden flex justify-between items-center">
      <div className="flex flex-grow items-center gap-3 bg-white rounded-ss-full rounded-es-full border-e-gray-300 focus-within:border-blue-600 border pl-3">
        <FaSearch
          size={15}
          className="text-gray-400 font-extralight hidden group-focus-within:block"
        />
        <input
          type="text"
          placeholder="search"
          className="peer text-lg py-1 flex-grow font-nunito_sans"
        />
      </div>
      <button className="rounded-se-full rounded-ee-full cursor-pointer px-4 py-1 text-sm text-gray-600">
        <Search />
      </button>
    </div>
  );
}
