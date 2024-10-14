import React from "react";
import { getIntials } from "../../utils/helper";

const Profolio = ({ user, LOgoutOut }) => {
  console.log(user?.user?.users[0].fullName);
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center text-black rounded-full bg-slate-400">
        {getIntials(user.user?.users[0].fullName)}
      </div>
      <div>
        <p className="text-sm font-medium">{user.user?.users[0].fullName}</p>
        <button
          className="text-sm text-slate-700 underline"
          onClick={LOgoutOut}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profolio;
