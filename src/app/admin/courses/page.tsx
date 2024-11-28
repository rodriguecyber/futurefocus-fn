"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/Model";
import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  Course,
} from "../../../context/courseContext";
import withAdminAuth from "@/components/withAdminAuth";
import Layout from "../Layout";
import { fetchUser, getLoggedUserData } from "@/context/adminAuth";
import { IUser } from "@/types";
import { hasPermission } from "@/config/hasPermission";
import { toast } from "react-toastify";
import axios from "axios";
import API_BASE_URL from "@/config/baseURL";


const CoursesComponent: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [shifts, setShifts] = useState<
    { _id: string; start: string; end: string }[]
  >([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<IUser | null>(null);

  // State for controlled form inputs
  const [formData, setFormData] = useState({
    title: "",
    rating: 1,
    image: "",
    scholarship: 0,
    nonScholarship: 0,
    shifts: [] as string[], // Store shift IDs
  });

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
        await fetchUser();
        setUserData(await getLoggedUserData());
      } catch (error) {
        console.error("Error fetching courses", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    const getShifts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/others/shift`);
        setShifts(response.data.shifts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
    getShifts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleShiftChange = (shiftId: string) => {
    setFormData((prevData) => {
      const newShifts = prevData.shifts.includes(shiftId)
        ? prevData.shifts.filter((id) => id !== shiftId)
        : [...prevData.shifts, shiftId];
      return { ...prevData, shifts: newShifts };
    });
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const newCourse: Course = {
        title: formData.title,
        rating: Number(formData.rating),
        image: formData.image,
        scholarship: Number(formData.scholarship),
        nonScholarship: Number(formData.nonScholarship),
        //@ts-expect-error error
        shifts: formData.shifts,
        active: false,
      };
      const response = await addCourse(newCourse);
      setCourses([...courses, response.data]);
      toast.success("Course added successfully!");
    } catch (error) {
      toast.error("Failed to add course.");
      console.error("Error adding course", error);
    } finally {
      setIsAddModalOpen(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const updatedCourse: Course = {
        ...editingCourse,
        title: formData.title,
        rating: Number(formData.rating),
        image: formData.image,
        scholarship: Number(formData.scholarship),
        nonScholarship: Number(formData.nonScholarship),
        //@ts-expect-error error
        shifts: formData.shifts,
        //@ts-expect-error error
        active: formData.active === "true" ? true : false,
      };

      if (editingCourse?._id) {
        await updateCourse(editingCourse._id, updatedCourse);
        setCourses(
          courses.map((c) => (c._id === editingCourse._id ? updatedCourse : c))
        );
        toast.success("Course updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update course.");
      console.error("Error updating course", error);
    } finally {
      setIsUpdateModalOpen(false);
      setEditingCourse(null);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    try {
      if (id) {
        await deleteCourse(id);
        setCourses(courses.filter((c) => c._id !== id));
        toast.success("Course deleted successfully!");
      } else {
        console.error("No id found for the course. Cannot delete.");
      }
    } catch (error) {
      toast.error("Failed to delete course.");
      console.error("Error deleting course", error);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      rating: course.rating,
      image: course.image,
      scholarship: course.scholarship,
      nonScholarship: course.nonScholarship,
      //@ts-expect-error error
      shifts: course.shifts || [],
    });
    setIsUpdateModalOpen(true);
  };

  const canCreate = userData
    ? hasPermission(userData, "courses", "create")
    : false;
  const canUpdate = userData
    ? hasPermission(userData, "courses", "update")
    : false;
  const canDelete = userData
    ? hasPermission(userData, "courses", "delete")
    : false;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
          <button
            disabled={!canCreate}
            onClick={() => setIsAddModalOpen(true)}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              !canCreate
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Add New Course
          </button>
        </div>

        {loading ? (
          <p>Loading courses...</p>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {course.title}
                  </h3>
                  <div className="flex items-center mt-2 justify-between">
                    <div className="">
                      <span className="text-yellow-400">
                        {"★".repeat(course.rating)}
                      </span>
                      <span className="ml-1 text-gray-500">
                        ({course.rating})
                      </span>
                    </div>
                    <span
                      className={`${
                        course.active ? "text-green-500" : "text-red-600"
                      }`}
                    >
                      {course.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button
                      disabled={!canUpdate}
                      onClick={() => handleEdit(course)}
                      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                        !canUpdate
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      }`}
                    >
                      Update
                    </button>
                    <button
                      disabled={!canDelete}
                      onClick={() => handleDelete(course._id)}
                      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                        !canDelete
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "text-red-700 bg-red-100 hover:bg-red-200"
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No courses available.</p>
        )}

        {/* Add Course Modal */}
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Add New Course</h2>
          <form onSubmit={handleAddSubmit}>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Course Title"
              className="input mb-4 w-full"
              required
            />
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              placeholder="Rating"
              className="input mb-4 w-full"
              min="1"
              max="5"
              required
            />
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="input mb-4 w-full"
            />
            <input
              type="number"
              name="scholarship"
              value={formData.scholarship}
              onChange={handleChange}
              placeholder="Scholarship Available"
              className="input mb-4 w-full"
              required
            />
            <input
              type="number"
              name="nonScholarship"
              value={formData.nonScholarship}
              onChange={handleChange}
              placeholder="Non-Scholarship Available"
              className="input mb-4 w-full"
              required
            />
            <div className="mb-4">
              <p className="font-medium">Shifts:</p>
              {shifts.map((shift) => (
                <div key={shift._id}>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.shifts.includes(shift._id)}
                      onChange={() => handleShiftChange(shift._id)}
                      className="mr-2"
                    />
                    {shift.start} - {shift.end}
                  </label>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Course
              </button>
            </div>
          </form>
        </Modal>

        {/* Update Course Modal */}
        {editingCourse && (
          <Modal
            isOpen={isUpdateModalOpen}
            onClose={() => setIsUpdateModalOpen(false)}
          >
            <h2 className="text-xl font-bold mb-4">Update Course</h2>
            <form onSubmit={handleUpdateSubmit}>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Course Title"
                className="input mb-4 w-full border-2 rounded-md p-2 "
                required
              />
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                placeholder="Rating"
                className="input mb-4 w-full border-2 rounded-md p-2"
                min="1"
                max="5"
                required
              />
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="input mb-4 w-full border-2 rounded-md p-2"
              />
              <input
                type="number"
                name="scholarship"
                value={formData.scholarship}
                onChange={handleChange}
                placeholder="Scholarship Available"
                className="input mb-4 w-full border-2 rounded-md p-2"
                required
              />
              <input
                type="number"
                name="nonScholarship"
                value={formData.nonScholarship}
                onChange={handleChange}
                placeholder="Non-Scholarship Available"
                className="input mb-4 w-full border-2 rounded-md p-2"
                required
              />
              <div className="mb-4">
                <p className="font-medium">Shifts:</p>
                <div className="border-2 rounded-md p-2 ">
                  {shifts.map((shift) => (
                    <label key={shift._id} className="flex items-center ">
                      <input
                        type="checkbox"
                        checked={formData.shifts.some(
                          //@ts-expect-error error
                          (item) => item._id === shift._id
                        )}
                        onChange={() => handleShiftChange(shift._id)}
                        className="mr-2"
                      />
                      {shift.start} - {shift.end}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Update Course
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default withAdminAuth(CoursesComponent);
