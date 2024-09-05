'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Layout";
import withAdminAuth from "@/components/withAdminAuth";
import API_BASE_URL from "@/config/baseURL";
import { X } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  selectedCourse: string;
  message: string;
  selectedShift: string;
  createdAt: string;
}

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get<Student[]>(`${API_BASE_URL}/students`);
        setStudents(
          response.data.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
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
      setSelectedStudent(null);
    } catch (error) {
      console.error("Error deleting student:", error);
      setError("Failed to delete student. Please try again.");
    }
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleAdmit = async (id: string) => {
    try {
      await axios.post(`${API_BASE_URL}/students/${id}/admit`);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <div className="max-w-full mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
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
                Course
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
                  {student.selectedCourse}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  {student.selectedShift}
                </td>
                <td className="px-6 py-4 border-b border-gray-300">
                  <button
                    onClick={() => handleView(student)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    View
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

      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Student Details</h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedStudent.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedStudent.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedStudent.phone}
              </p>
              <p>
                <strong>Course:</strong> {selectedStudent.selectedCourse}
              </p>
              <p>
                <strong>Shift:</strong> {selectedStudent.selectedShift}
              </p>
              <p>
                <strong>Date Applied:</strong>{" "}
                {formatDate(selectedStudent.createdAt)}
              </p>
              <p>
                <strong>Message:</strong> {selectedStudent.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default withAdminAuth(StudentManagement);
