"use client";
import React, { useState } from "react";
import { FaArrowRight, FaBars } from "react-icons/fa";

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisisbility = (e: any) => {
    e.preventDefault();

    setIsVisible(!isVisible);
  };
  return (
    <div className="flex flex-col bg-black lg:flex-row lg:text-center lg:items-center justify-between lg:px-20 shadow-lg sticky top-0 z-50  ">
      <span className="w-full lg:w-auto flex flex-row justify-between items-center px-7 lg:px-0">
        <img src="/ffocus.png" alt="our logo" className="w-24" />
        <a
          href="/application"
          className="flex flex-row items-center gap-1 lg:hidden bg-yellow-500 p-2 text-white  lg:w-auto  "
        >
          <h1 className="text-sm">APPLY NOW</h1>
        </a>
        <FaBars
          width={32}
          id="bars"
          className="lg:hidden"
          onClick={toggleVisisbility}
        />
      </span>
      <div
        className={`lg:flex flex-col lg:flex-row gap-2 w-full lg:w-auto ${
          isVisible ? "flex" : "hidden"
        }`}
      >
        <div
          className={`flex flex-col lg:flex-row gap-2 text-white text-sm px-2 w-full lg:w-auto `}
        >
          <a href="/" className="hover:text-green-800 font-extrabold">
            HOME
          </a>
          <a href="/about" className="hover:text-green-800 font-extrabold">
            ABOUT
          </a>
          <a href="/contact" className="hover:text-green-800 font-extrabold">
            CONTACT
          </a>
        </div>
        <a
          href="/application"
          className="hidden lg:flex flex-row items-center gap-1 bg-yellow-500 p-1 py-0  rounded-md font-extrabold w-full lg:w-auto  "
        >
          <h1 className="text-sm">APPLY NOW</h1>
          <FaArrowRight />
        </a>
      </div>
    </div>
  );
};

export default Header;
