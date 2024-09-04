"use client";

import React from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";
import {
  FaLocationDot,
} from "react-icons/fa6";

const ContactForm = () => {
 
  return (
    <div className="flex flex-col lg:flex-row mx-32 gap-20  mb-10">
      <div className="flex flex-col gap-4">
        <div className="">
          <h1 className="text-cyan-600 text-2xl">Get In Touch</h1>
          <p>
            Future Focus is a multimedia entertainment company which creates,
            produces, distributes, licenses, educates and supplies profitable
            positive audio visual entertainment to a diverse and international
            consumer group. We are specialized in both productions and training.
          </p>
        </div>
        <div className=" flex flex-col gap-6 ">
          <div className="flex flex-row items-center gap-1">
            <div className="p-3  bg-cyan-600">
              <FaLocationDot size={25} color="white" className="  " />
            </div>
            <div className="gap-4">
              <h3 className="text-cyan-600 text-xl">Office</h3>
              <p>Kigali, Remera, Giporoso</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="p-3  bg-cyan-600">
              <FaPhone size={25} color="white" className="  " />
            </div>
            <div className="gap-4">
              <h3 className="text-cyan-500 text-xl">Mobile</h3>
              <p>(+250) 788 518 845</p>
              <p>(+250) 798 664 112</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="p-3  bg-cyan-600">
              <FaEnvelope size={25} color="white" className="  " />
            </div>
            <div className="gap-4">
              <h3 className="text-cyan-600 text-xl">Email</h3>
              <p>futurefocusacademie@gmail.com</p>
              <p>futurefocusforum@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-6 wow fadeInUp " data-wow-delay="0.3s">
        <iframe
          className="position-relative rounded w-80 h-100"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d194.05239600637108!2d30.11755319135457!3d-1.9597409164714374!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca74cc63da3e9%3A0x6f33e2d145623012!2sFUTURE%20FOCUS!5e1!3m2!1sen!2srw!4v1719660638598!5m2!1sen!2srw"
          width="600"
          height="450"
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="w-full max-w-xl mx-auto  ">
        <form className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                id="name"
                placeholder=" "
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-600"
              />
              <label
                htmlFor="name"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all transform scale-75 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-3.5"
              >
                Your Name
              </label>
            </div>
            <div className="relative flex-1">
              <input
                type="email"
                id="email"
                placeholder=" "
                className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-600"
              />
              <label
                htmlFor="email"
                className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all transform scale-75 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-3.5"
              >
                Your Email
              </label>
            </div>
          </div>

          <div className="relative">
            <input
              type="number"
              id="phone"
              placeholder=" "
              className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-600"
            />
            <label
              htmlFor="phone"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all transform scale-75 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-3.5"
            >
              Phone Number
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="subject"
              placeholder=" "
              className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-600"
            />
            <label
              htmlFor="subject"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all transform scale-75 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-3 peer-focus:scale-75 peer-focus:-translate-y-3.5"
            >
              Subject
            </label>
          </div>

          <div className="relative">
            <textarea
              id="message"
              placeholder=" "
              className="peer h-32 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-cyan-600"
            />
            <label
              htmlFor="message"
              className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all transform scale-75 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-12 peer-focus:scale-75 peer-focus:-translate-y-3.5"
            >
              Message
            </label>
          </div>
          <div className="w-full">
            <button className="bg-blue-600 p-2  text-white  ">SEND</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
