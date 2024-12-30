"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "@/config/baseURL";
import { toast } from "react-toastify";
import { Course } from "@/context/courseContext";

// Define the shape of the application data
interface ApplicationData {
  name: string;
  email: string;
  phone: string;
  referer:'default'|'cyd',
  selectedCourse: string;
  selectedShift: string;
  intake: string;
  message: string;
}

interface IntakeData {
  _id: string;
  intake: string;
}

const ApplicationForm: React.FC = () => {
  const [formData, setFormData] = useState<ApplicationData>({
    name: "",
    email: "",
    phone: "",
    referer:'default',
    selectedCourse: "",
    selectedShift: "",
    intake: "",
    message: "",
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [intakes, setIntakes] = useState<IntakeData[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/course`);
        setCourses(response.data);

        if (response.data.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            selectedCourse: response.data[0]._id,
            selectedShift: response.data[0].shifts[0]._id,

          }));
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load courses.");
        setLoading(false);
      }
    };

    const getIntakes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/others/intake`);
        setIntakes(response.data.intakes);
        if (response.data.intakes.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            intake: response.data.intakes[0].intake,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    };

    getIntakes();
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

    if (name === "selectedCourse") {
      const selectedCourse = courses.find((course) => course.title === value);
      if (selectedCourse) {
        setFormData((prevData) => ({
          ...prevData,
          selectedShift: selectedCourse.shifts[0]._id,
        }));
      }
    }
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

      if (response.data && response.data.message) {
        toast.success(response.data.message);
      } else {
        toast.success("Application submitted successfully");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        referer:'default',
        selectedCourse: courses.length > 0 ? courses[0].title : "",
        selectedShift: courses.length > 0 ? courses[0].shifts[0]._id : "",
        message: "",
        intake: intakes.length > 0 ? intakes[0].intake : "",
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
      <a
        href="/"
        className="p-2 fixed top-3 left-1 bg-blue-600 text-white hover:bg-blue-500 rounded-md"
      >
        Back home
      </a>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
        FILL OUT THE FORM CORRECTLY
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-extrabold text-gray-700">
              FULL NAME
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
            <label className="block text-sm font-extrabold text-gray-700">
              EMAIL
            </label>
            <input
              type="email"
              name="email"
              placeholder="test@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-extrabold text-gray-700">
            PHONE
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
          <label className="block text-sm font-extrabold text-gray-700">
            SELCT A COURSE
          </label>
          <select
            name="selectedCourse"
            value={formData.selectedCourse}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {courses
              .filter((course) => course.active)
              .map((course) => (
                <option key={course.title} value={course._id}>
                  {course.title}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-extrabold text-gray-700">
            SELECT A SHIFT
          </label>
          <select
            name="selectedShift"
            value={formData.selectedShift}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {courses
              .find((course) => course._id === formData.selectedCourse)
              ?.shifts.map((shift) => (
                <option key={shift._id} value={shift._id}>
                 {shift.name}{' '} {shift.start}{' - '}{shift.end}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-extrabold text-gray-700">
            SELECT INTAKE
          </label>
          <select
            name="intake"
            value={formData.intake}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>
              Select Intake (Required)
            </option>
            {intakes.map((intake) => (
              <option key={intake._id} value={intake.intake}>
                {intake.intake}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-extrabold text-gray-700">
          MESSAGE
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
            className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-extrabold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
