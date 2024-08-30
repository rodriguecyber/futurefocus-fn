'use client'
import API_BASE_URL from "@/config/baseURL";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import * as FaIcons from "react-icons/fa"; // Import all icons

interface Service {
  _id: string;
  icon: string; 
  title: string;
  subservices: string[];
}
const WhyUs = () => {
   const [services, setServices] = useState<Service[]>([]);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
     fetchServices();
   }, []);
   const renderIcon = (iconName: string) => {
     const IconComponent = FaIcons[iconName as keyof typeof FaIcons]; // Get the icon component by name
     return IconComponent ? <IconComponent /> : <FaIcons.FaStar />; // Default to FaStar if icon not found
   };
   const fetchServices = async () => {
     try {
       const response = await axios.get(`${API_BASE_URL}/service`);
       setServices(response.data);
       setError(null); // Clear error if fetch is successful
     } catch (error) {
       console.error("Error fetching services", error);
       setError("Failed to fetch services. Please try again.");
     }
   };
  return (
    <div className="flex flex-col lg:flex-row items-center mx-auto w-full px-4">
      <img
        src="/logo.png"
        alt="futurefocus logo"
        className="w-2/5 hidden lg:block"
      />
      <div className="w-full text-center lg:text-left">
        <div className="mx-auto">
          <h1 className="text-xl text-cyan-500 mb-4">Why Choose Us</h1>
          <p className="w-full lg:w-3/5 mx-auto lg:mx-0">
            We are innovative and passionate about the work we do. Our Technical
            Production Team is available 24/7. We deliver to you in full, on
            time.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-5 mx-auto">
          {services.map((service, index) => (
            <span
              key={index}
              className="flex flex-row gap-1 items-center justify-center lg:justify-start"
            >
              <FaArrowRight className="text-cyan-500" />
              <p>{service.title}</p>
            </span>
          ))}
        </div>
        <button className="py-5 px-10 text-white mt-5 bg-cyan-700 mx-auto lg:mx-0">
          View More
        </button>
      </div>
    </div>
  );
};

export default WhyUs;
