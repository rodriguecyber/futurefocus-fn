"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/Model";
import {
  Course,
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
} from "../../../context/courseContext";
import withAdminAuth from "@/components/withAdminAuth";
import Layout from "../Layout";
import { fetchUser, getLoggedUserData } from "@/context/adminAuth";
import { IUser } from "@/types";
import { hasPermission } from "@/config/hasPermission";
import { toast } from "react-toastify";
import axios from "axios";
import API_BASE_URL from "@/config/baseURL";
import { ShieldAlert } from "lucide-react";

const CoursesComponent: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [shifts, setShifts] = useState<{_id:string,start:string,end:string}[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<IUser | null>(null);


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
        await fetchUser()
        setUserData(await getLoggedUserData())
      } catch (error) {
        console.error("Error fetching courses", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    const getIntakes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/others/shift`);
        setShifts(response.data.shifts);
        await fetchUser();
        setUserData(await getLoggedUserData());
        console.log(userData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
    getIntakes()
  }, []);

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCourse: Course = {
      title: formData.get("title") as string,
      rating: Number(formData.get("rating")),
      image: formData.get("image") as string,
      scholarship: Number(formData.get("scholarship")),
      nonScholarship: Number(formData.get("nonScholarship")),
      //@ts-expect-error error
      shifts: formData.get("shifts")?.toString().split(",") || [],
      active: false
    };

    try {
      const response = await addCourse(newCourse);
      setCourses([...courses, response.data])
      toast.success('courses added sucessfully')
    } catch (error) {
      console.error("Error adding course", error);
      toast.error("failed to add course");

    } finally {
      setIsAddModalOpen(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedCourse: Course = {
      ...editingCourse,
      title: formData.get("title") as string,
      rating: Number(formData.get("rating")),
      image: formData.get("image") as string,
      scholarship: Number(formData.get("scholarship")),
      active: formData.get("active"),
      nonScholarship: Number(formData.get("nonScholarship")),
      shifts: formData.get("shifts")?.toString().split(",") || [],
    } as unknown as Course;

    try {
      if (editingCourse?._id) {
        await updateCourse(editingCourse._id, updatedCourse);
        setCourses(
          courses.map((c) => (c._id === editingCourse._id ? updatedCourse : c))
        );
      toast.success("courses updated sucessfully");

      }
    } catch (error) {
      toast.error("failed to update course");
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
      toast.success("courses deleted sucessfully");

      } else {
        console.error("No id found for the course. Cannot delete.");
      }
    } catch (error) {
      toast.error("failed to delete course");
      console.error("Error deleting course", error);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsUpdateModalOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
          <button
            disabled={!hasPermission(userData as IUser, "courses", "create")}
            onClick={() => setIsAddModalOpen(true)}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              !hasPermission(userData as IUser, "courses", "create")
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
                  <div className="flex items-center mt-2  justify-between">
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
                      {course.active ? "Active" : "Disactive"}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button
                      disabled={
                        !hasPermission(userData as IUser, "courses", "create")
                      }
                      onClick={() => handleEdit(course)}
                      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                        !hasPermission(userData as IUser, "courses", "update")
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-indigo-100  text-indigo-700 hover:bg-indigo-200"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      Update
                    </button>
                    <button
                      disabled={
                        !hasPermission(userData as IUser, "courses", "delete")
                      }
                      onClick={() => handleDelete(course._id)}
                      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                        !hasPermission(userData as IUser, "courses", "delete")
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "text-red-700 bg-red-100 hover:bg-red-200"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
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

        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Add New Course</h2>
          <form onSubmit={handleAddSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Course Title"
              required
              className="mb-2 w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="description"
              placeholder="Course Description"
              required
              className="mb-2 w-full px-3 py-2 border rounded"
            />
            <input
              type="number"
              name="rating"
              placeholder="Rating (1-5)"
              min="1"
              max="5"
              required
              className="mb-2 w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              required
              className="mb-2 w-full px-3 py-2 border rounded"
            />
            <input
              type="number"
              name="scholarship"
              placeholder="Scholarship"
              required
              className="mb-2 w-full px-3 py-2 border rounded"
            />
            <input
              type="number"
              name="nonScholarship"
              placeholder="Non-Scholarship"
              required
              className="mb-2 w-full px-3 py-2 border rounded"
            />
            <div className="mb-2 w-full px-3 py-2 border rounded">
              {shifts.map((shift) => (
                <div key={shift._id} className="flex  gap-2">
                  <input
                    value={shift._id}
                    name="shifts"
                    type="checkbox"
                  />
                  <p>
                    {shift.start} - {shift.end}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Course
            </button>
          </form>
        </Modal>

        <Modal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        >
          <h2 className="text-xl font-bold mb-4">Update Course</h2>
          <form onSubmit={handleUpdateSubmit}>
            <label htmlFor="titel">Title</label>
            <input
              type="text"
              name="title"
              defaultValue={editingCourse?.title}
              required
              className="mb-2 w-full px-3 py-2 border rounded"
            />

            <label htmlFor="title">Rating</label>

            <input
              type="number"
              name="rating"
              defaultValue={editingCourse?.rating}
              min="1"
              max="5"
              required
              className="mb-2 w-full px-3 py-2 border rounded"
              placeholder={editingCourse?.rating ? "rating" : ""}
            />
            <label htmlFor="titel">image</label>

            <input
              type="text"
              name="image"
              defaultValue={editingCourse?.image}
              required
              className="mb-2 w-full px-3 py-2 border rounded"
            />
            <label htmlFor="titel">Price for scholarship</label>

            <input
              type="number"
              name="scholarship"
              defaultValue={editingCourse?.scholarship}
              required
              className="mb-2 w-full px-3 py-2 border rounded"
              placeholder={editingCourse?.image ? "scholarship price" : ""}
            />
            <label htmlFor="titel">Price for non Scholarship</label>

            <input
              type="number"
              name="nonScholarship"
              defaultValue={editingCourse?.nonScholarship}
              required
              className="mb-2 w-full px-3 py-2 border rounded"
              placeholder={editingCourse?.rating ? "non scholarship price" : ""}
            />
            <label htmlFor="active">Enable / disable</label>

            <select
              name="active"
              id=""
              defaultValue={editingCourse?.active as any}
              className="mb-2 w-full px-3 py-2 border rounded"
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
            <label htmlFor="titel">Shift separated by comma</label>

            <div className="mb-2 w-full px-3 py-2 border rounded">
              {shifts.map((shift) => (
                <div key={shift._id} className="flex  gap-2">
                  <input
                    value={shift._id}
                    name="shifts"
                    //@ts-expect-error
                    checked={editingCourse?.shifts?.includes(shift._id)}
                    type="checkbox"
                  />
                  <p>
                    {shift.start} - {shift.end}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded"
            >
              Update Course
            </button>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default withAdminAuth(CoursesComponent);
