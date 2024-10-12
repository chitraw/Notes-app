import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
const Password = ({ value, placeholder, onChange }) => {
  console.log(onChange);
  const [isShowpassword, setisShowpassword] = useState(false);

  const ToggleFunction = () => {
    setisShowpassword(!isShowpassword);
  };
  return (
    <div className="flex itemx-center bg-transparent border-[1.5px] px-5 rounded mb-2">
      <input
        value={value}
        placeholder={placeholder || "Password"}
        onChange={onChange}
        type={isShowpassword ? "text" : "password"}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
      />
      {isShowpassword ? (
        <FaRegEye
          size={22}
          className="cursor-pointer text-blue-500 mt-2"
          onClick={() => ToggleFunction()}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="cursor-pointer text-slate-500 mt-2"
          onClick={() => ToggleFunction()}
        />
      )}
    </div>
  );
};

export default Password;
