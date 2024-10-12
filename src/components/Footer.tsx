"use client";
import API_BASE_URL from "@/config/baseURL";
import axios from "axios";
import { response } from "express";
import React, { useState } from "react";
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
import { toast } from "react-toastify";

const Footer = () => {
  const [email,setEmail] = useState('')
  const handleChangeEmail = (e:React.ChangeEvent<HTMLInputElement>)=>{
     setEmail(e.target.value)
  }
  const handleSubscribe = async()=>{
     if(!email.includes('@gmail.com'))
  toast.error('enter valid email')
    try {
    const response = await axios.post(`${API_BASE_URL}/admin/subscribe`, {
      email:email
    })
    toast.success(response.data.message)
    } catch (error:any) {
      if(axios.isAxiosError(error) && error.response)
      {
        toast.error(error.response.data.message);
      }
      else{
        toast.error('failed to subscribe! try again')
      }
    }
  
  }
  return (
    <div className="bg-blue-950 w-full text-white py-10">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5  ">
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
              <a href="https://x.com/FF_Academie">
                <FaXTwitter className="text-2xl" />
              </a>
              <a href="https://www.instagram.com/future_focus_academy/">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="https://www.youtube.com/@kigalifamemedia">
                <FaYoutube className="text-2xl" />
              </a>
              <a href="https://www.facebook.com/Futurefocuspics">
                <FaFacebook className="text-2xl" />
              </a>
              {/* <a href="#">
                <FaLinkedin className="text-2xl" />
              </a> */}
            </div>
          </div>

        
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold mb-4">Donate</h1>
            <div className="grid grid-cols-2 gap-2">
              <a href="/">
                <img src="/momo.png" alt="momo" className="w-full h-auto" />
              </a>
              <a href="/">
                <img src="/aittel.png" alt="Airtel" className="w-full h-auto" />
              </a>
              <a href="/">
                <img src="/paypal.png" alt="Paypal" className="w-full h-auto" />
              </a>
            </div>
          </div>

        
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold mb-4 text-center lg:text-left">
              Newsletter
            </h1>
            <div className="bg-white flex flex-row rounded-lg">
              <input
                type="email"
                placeholder="Your email"
                className="py-3 px-2 flex-1 border-none outline-none text-black"
                onChange={handleChangeEmail}
              />
              <button
                className="bg-cyan-800 py-3 px-2"
                onClick={handleSubscribe}
              >
                Subscribe
              </button>
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
