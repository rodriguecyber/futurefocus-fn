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

const CoursesComponent: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
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

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCourse: Course = {
      title: formData.get("title") as string,
      image: formData.get("image") as string,
      rating: Number(formData.get("rating")),
    };

    try {
      const response = await addCourse(newCourse);
      setCourses([...courses, response.data]);
    } catch (error) {
      console.error("Error adding course", error);
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
      image: formData.get("image") as string,
      rating: Number(formData.get("rating")),
    } as Course;

    try {
      if (editingCourse?._id) {
        console.log("Updating course with id:", editingCourse._id); // Debug log
        await updateCourse(editingCourse._id, updatedCourse);
        setCourses(
          courses.map((c) => (c._id === editingCourse._id ? updatedCourse : c))
        );
      }
    } catch (error) {
      console.error("Error updating course", error);
    } finally {
      setIsUpdateModalOpen(false);
      setEditingCourse(null);
    }
  };

  const handleDelete = async (id: string |undefined ) => {
    console.log("Deleting course with id:", id); // Debug log
    try {
      if (id) {
        await deleteCourse(id);
        setCourses(courses.filter((c) => c._id !== id));
      } else {
        console.error("No id found for the course. Cannot delete.");
      }
    } catch (error) {
      console.error("Error deleting course", error);
    }
  };

  const handleEdit = (course: Course) => {
    console.log("Editing course:", course); // Debug log
    setEditingCourse(course);
    setIsUpdateModalOpen(true);
  };

  return (
    < Layout >
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Courses</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
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
                <div className="flex items-center mt-2">
                  <span className="text-yellow-400">
                    {"★".repeat(course.rating)}
                  </span>
                  <span className="ml-1 text-gray-500">({course.rating})</span>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEdit(course)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
            name="image"
            placeholder="Image URL"
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
          <input
            type="text"
            name="title"
            defaultValue={editingCourse?.title}
            required
            className="mb-2 w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="image"
            defaultValue={editingCourse?.image}
            required
            className="mb-2 w-full px-3 py-2 border rounded"
          />
          <input
            type="number"
            name="rating"
            defaultValue={editingCourse?.rating}
            min="1"
            max="5"
            required
            className="mb-2 w-full px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-2 rounded"
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
