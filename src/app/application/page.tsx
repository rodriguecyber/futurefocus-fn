"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "@/config/baseURL";
import { toast } from "react-toastify";

interface Course {
  title: string;
}

interface ApplicationData {
  name: string;
  email: string;
  phone: string;
  selectedCourse: string;
  selectedShift: string;
  message: string;
}

const shiftOptions = ["Morning", "Afternoon", "Evening", "Weekend"];


const ApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState<ApplicationData>({
    name: "",
    email: "",
    phone: "",
    selectedCourse: "",
    selectedShift: shiftOptions[0], 
    message: "",
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/course`);
        setCourses(response.data);

        if (response.data.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            selectedCourse: response.data[0].title, 
          }));
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load courses.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
      const response = await axios.post(
        `${API_BASE_URL}/students/apply`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Success:", response.data);

      
      setFormData({
        name: "",
        email: "",
        phone: "",
        selectedCourse: courses.length > 0 ? courses[0].title : "",
        selectedShift: shiftOptions[0], 
        message: "",
      });
   toast.success('application submitted')
    } catch (error) {
      console.error("Error:", error);
      toast.error('error in application try again!')
    }
  };

  if (loading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <a href="/" className="p-2 fixed top-3 left-1 bg-blue-600 text-white hover:bg-blue-500 rounded-md">Back home</a>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
        Apply for a Scholarship
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select a Course
          </label>
          <select
            name="selectedCourse"
            value={formData.selectedCourse}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {courses.map((course) => (
              <option key={course.title} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select a Shift
          </label>
          <select
            name="selectedShift"
            value={formData.selectedShift}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {shiftOptions.map((shift) => (
              <option key={shift} value={shift}>
                {shift}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
            placeholder="Write a message (optional)"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
