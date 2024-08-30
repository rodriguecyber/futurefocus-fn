"use client";
import React from "react";
import {
  FaEnvelope,
  FaFacebook,
  FaGreaterThan,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaYoutube,
} from "react-icons/fa";
import { FaMapLocation, FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="bg-blue-950 w-full text-white py-10">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Quick Links */}
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold mb-4">Quick Links</h1>
            <span className="flex flex-row items-center mb-2">
              <FaGreaterThan className="mr-2" />
              <a href="/about">About Us</a>
            </span>
            <span className="flex flex-row items-center mb-2">
              <FaGreaterThan className="mr-2" />
              <a href="/contact">Contact Us</a>
            </span>
            <span className="flex flex-row items-center mb-2">
              <FaGreaterThan className="mr-2" />
              <a href="">Privacy Policy</a>
            </span>
            <span className="flex flex-row items-center mb-2">
              <FaGreaterThan className="mr-2" />
              <a href="">Terms and Conditions</a>
            </span>
            <span className="flex flex-row items-center mb-2">
              <FaGreaterThan className="mr-2" />
              <a href="">FAQs and Help</a>
            </span>
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg font-semibold mb-4">Get In Touch</h1>
            <span className="flex flex-row items-center mb-2">
              <FaMapLocation className="mr-2" />
              <p>Kigali - Remera - Giporoso</p>
            </span>
            <span className="flex flex-row items-center mb-2">
              <FaPhone className="mr-2" />
              <p>(+250) 788 518 845</p>
            </span>
            <span className="flex flex-row items-center mb-2">
              <FaPhone className="mr-2" />
              <p>(+250) 798 664 112</p>
            </span>
            <span className="flex flex-row items-center mb-2">
              <FaEnvelope className="mr-2" />
              <p>futurefocusforum@gmail.com</p>
            </span>
            <span className="flex flex-row items-center mb-2">
              <FaEnvelope className="mr-2" />
              <p>futurefocusacademie@gmail.com</p>
            </span>
            <div className="flex flex-row gap-2 mt-4">
              <a href="#">
                <FaXTwitter className="text-2xl" />
              </a>
              <a href="#">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="#">
                <FaYoutube className="text-2xl" />
              </a>
              <a href="#">
                <FaFacebook className="text-2xl" />
              </a>
              <a href="#">
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Gallery */}
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold mb-4">Gallery</h1>
            <div className="grid grid-cols-2 gap-2">
              <img
                src="/gallery1.jpg"
                alt="Gallery 1"
                className="w-full h-auto"
              />
              
              <img
                src="/gallery4.jpg"
                alt="Gallery 4"
                className="w-full h-auto"
              />
              <img
                src="/gallery5.jpg"
                alt="Gallery 5"
                className="w-full h-auto"
              />
              <img
                src="/gallery6.jpg"
                alt="Gallery 6"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold mb-4 text-center lg:text-left">
              Newsletter
            </h1>
            <div className="bg-white flex flex-row rounded-lg">
              <input
                type="email"
                placeholder="Your email"
                className="py-3 px-3 flex-1 border-none outline-none text-black"
              />
              <button className="bg-cyan-800 py-3 px-4">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="mt-10 text-center">
          <p>
            &copy; {new Date().getFullYear()} Future Focus. All rights reserved.
            || Developer{" "}
            <a
              href="https://rwigara.vercel.app/about"
              className="text-cyan-800"
            >
              Rodrigue
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
