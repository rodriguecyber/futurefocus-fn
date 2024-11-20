
'use client'
import API_BASE_URL from "@/config/baseURL";
import axios from "axios";
import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa"; // Import all icons
import { FaTableList } from "react-icons/fa6";

interface Service {
  _id: string;
  icon: string; // Icon name
  title: string;
  subservices: string[];
}


const OurServices = () => {
 const [services, setServices] = useState<Service[]>([]);
 const [error, setError] = useState<string | null>(null);
 

 useEffect(() => {
   fetchServices();
 }, []);
const renderIcon = (iconName: string) => {
  const IconComponent = FaIcons[iconName as keyof typeof FaIcons]; // Get the icon component by name
  return IconComponent ? (
    <IconComponent className="text-7xl mx-auto " />
  ) : (
    <FaIcons.FaStar className="text-7xl mx-auto" />
  ); // Default to FaStar if icon not found
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
    <div>
      <h4 className="text-center text-xl text-cyan-600 mt-20">OUR SERVICES </h4>
      <div className="grid grid-1  md:grid-2 lg:grid-cols-4  gap-5 mx-5 lg:mx-20 mt-10">
        {services.map((service) => (
          <div key={service._id} className="bg-[#297B66] p-5 rounded  ">
           < div className="mx-auto  h-50 ">  {renderIcon(service.icon)}</div> 
            <h3 className="text-xl text-center py-5 text-black font-bold">
              {service.title}
            </h3>
            <div className=" flex flex-col gap-2">
              {service.subservices.map((sub) => (
                <span key={service.subservices.indexOf(sub)} className="flex flex-row gap-2  items-center ">
                  <FaTableList />
                  <p className="text-white  ">{sub}</p>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurServices;
