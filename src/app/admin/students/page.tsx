"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Layout";
import withAdminAuth from "@/components/withAdminAuth";
import API_BASE_URL from "@/config/baseURL";
interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  selectedCourse: string;
  message: string;
  selectedShift: string;
}



const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null); // Added state for error handling

  useEffect(() => {
    // Fetch students data from backend on component mount
    const fetchStudents = async () => {
      try {
        const response = await axios.get<Student[]>(`${API_BASE_URL}/students`);
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError("Failed to load student data. Please try again later.");
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/students/${id}`);
      setStudents(students.filter((student) => student.id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Failed to delete student. Please try again.");
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit student with ID:", id);
    // Implement edit functionality
  };

  const handleView = (id: string) => {
    console.log("View student with ID:", id);
    // Implement view functionality
  };

  const handleAdmit = async (id: string) => {
    try {
      await axios.post(`${API_BASE_URL}/students/${id}/admit`);
      // Handle success, e.g., refresh data
    } catch (error) {
      console.error("Error admitting student:", error);
      setError("Failed to admit student. Please try again.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.post(`${API_BASE_URL}/students/${id}/reject`);
      // Handle success, e.g., refresh data
    } catch (error) {
      console.error("Error rejecting student:", error);
      setError("Failed to reject student. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          Applied Students
        </h2>
        {error && <p className="text-red-600">{error}</p>}
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">
                Shift
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-800 tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 border-b border-gray-300">
                  {student.name}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {student.email}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {student.phone}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {student.selectedShift}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  <button
                    onClick={() => handleView(student.id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(student.id)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="text-red-600 hover:text-red-900 mr-3"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleAdmit(student.id)}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Admit
                  </button>
                  <button
                    onClick={() => handleReject(student.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default withAdminAuth(StudentManagement);
