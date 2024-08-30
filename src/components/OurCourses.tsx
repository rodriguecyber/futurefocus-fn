import { Courses } from "@/arrays/Courses";
import { getCourses,Course } from "@/context/courseContext";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

const OurCourses = () => {
const [courses, setCourses] = useState<Course[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else {
        console.error("Unexpected data format:", response.data);
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, []);

  return (
    <div className="px-4 lg:px-10 py-8">
      <h4 className="text-center text-xl text-cyan-600 mb-6">Our Courses</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {courses.map((course, index) => (
          <div
            key={index}
            className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden"
          >
            <div className="w-full h-80 relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col p-4 bg-cyan-800 text-white">
              <span className="flex mb-2 mx-auto">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </span>
              <h1 className="text-lg font-semibold mb-2 mx-auto">{course.title}</h1>
              <div className="flex flex-row mx-auto gap-2">
                <a
                  href="##"
                  className="px-5 py-2 bg-cyan-700 text-center rounded-lg hover:bg-cyan-600"
                >
                  View More
                </a>
                <a
                  href="/application"
                  className="px-5 py-2 bg-cyan-700 text-center rounded-lg hover:bg-cyan-600"
                >
                  Join Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurCourses;
