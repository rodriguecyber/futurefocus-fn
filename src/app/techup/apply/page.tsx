"use client";
import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "@/config/baseURL";
import { toast } from "react-toastify";

// Define the shape of the application data
interface ApplicationData {
  name: string;
  email: string;
  phone: string;
  gender: string;
}

const ApplicationForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ApplicationData>({
    name: "",
    email: "",
    phone: "",
    gender: "male",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const response = await axios.post(
        `${API_BASE_URL}/students/techup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.message) {
        toast.success(response.data.message);
      } else {
        toast.success("Application submitted successfully");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "male",
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message || "An error occurred. Please try again.";
        console.error(error.response.data);
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 shadow-lg rounded-lg mt-12">
      <a
        href="/"
        className="p-3 fixed top-5 left-4 bg-indigo-600 text-white hover:bg-indigo-500 rounded-md text-lg"
      >
        Home
      </a>
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
        Join TechUp: Application Form
      </h2>
      <p className="text-lg text-gray-700 text-center mb-8">
        Fill out the form below to apply for the TechUp program and take the
        first step towards advancing your software development skills!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xl font-semibold text-gray-800 mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="w-full px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-md shadow-lg transform transition duration-200 hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isLoading ? "Submitting...." : " Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
