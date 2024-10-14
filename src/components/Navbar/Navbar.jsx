import React, { useState } from "react";
import Profolio from "../Card/Profolio";
import SearchBox from "../SearchBox/SerachBox";
import { useNavigate } from "react-router-dom";
function Navbar(user, onSearchNote) {
  const [SearchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  function handleDelete() {
    setSearchQuery("");
  }
  function handleSearch() {
    if (SearchQuery) {
      onSearchNote(SearchQuery);
    }
  }
  const LOgoutOut = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4 shadow-xl">
        <h2 className="text-xl font-medium text-black py-2">Notes </h2>
        <SearchBox
          value={SearchQuery}
          onChange={({ target }) => {
            setSearchQuery(target.value);
          }}
          handleSearch={handleSearch}
          handleDelete={handleDelete}
        />
        <Profolio user={user} LOgoutOut={LOgoutOut} />
      </div>
    </div>
  );
}

export default Navbar;
