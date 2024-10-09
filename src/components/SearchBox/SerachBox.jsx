import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBox = ({ onChange, value, handleSearch, handleDelete }) => {
  return (
    <div className="flex w-80 items-center rounded-sm px-4 bg-slate-100">
      <input
        type="text"
        className="w-full py-[11px] bg-transparent outline-none text-sm"
        value={value}
        placeholder="Search..."
        onChange={onChange}
      />
      {value && (
        <IoMdClose
          className="cursor-pointer hover:text-black text-slate-400 mr-3"
          onClick={handleDelete}
        />
      )}
      <FaMagnifyingGlass
        className="cursor-pointer hover:text-black text-slate-400"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBox;
