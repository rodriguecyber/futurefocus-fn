"use client";
import React, { useState } from "react";
import { FaArrowRight, FaBars } from "react-icons/fa";

const Header = () => { 
  const [isVisible, setIsVisible]  = useState(false)
  const toggleVisisbility =(e:any)=>{
    e.preventDefault();

  setIsVisible(!isVisible)
  }
  return (
    <div className="flex flex-col lg:flex-row lg:text-center lg:items-center justify-between lg:px-20 shadow-lg sticky top-0 z-50  bg-white">
      <span className="w-full lg:w-auto flex flex-row justify-between items-center px-7 lg:px-0">
        <img src="/logo.png" alt="our logo" className="w-24" />
        <a
          href="/application"
          className="flex flex-row items-center gap-1 lg:hidden bg-green-900 p-2 text-white  lg:w-auto  "
        >
          <h1 className="text-sm">APPLY TODAY</h1>
          <FaArrowRight />
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
          className={`flex flex-col lg:flex-row gap-2 text-green-950 text-sm p-2 w-full lg:w-auto `}
        >
          <a href="/" className="hover:text-black">
            HOME
          </a>
          <a href="/about" className="hover:text-black">
            ABOUT
          </a>
          <a href="/contact" className="hover:text-black">
            CONTACT
          </a>

          <a href="/admin/login" className="hover:text-black">
            ADMIN
          </a>
        </div>
        <a
          href="/application"
          className="flex flex-row items-center gap-1 bg-green-900 p-2 text-white w-full lg:w-auto  "
        >
          <h1 className="text-sm">APPLY TODAY</h1>
          <FaArrowRight />
        </a>
      </div>
    </div>
  );
};

export default Header;
