"use client";

import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { toast } from "react-toastify";
import withAdminAuth from "@/components/withAdminAuth";
import axios from "axios";
import API_BASE_URL from "@/config/baseURL";
import { fetchUser } from "@/context/adminAuth";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

interface AdminType {
  _id: string;
  name: string;
  email: string;
  role:{role:string}
}

const MembersPage: React.FC = () => {
  const { logout } = useAuth(); // Get the logout function
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [logedUser, setLogeduser] = useState<AdminType>();
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    id: "",
  });

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/admins`);
      setAdmins(response.data);
    } catch (error) {
      console.error("Failed to fetch admins", error);
    }
  };

  useEffect(() => {
    const loadAdmins = async () => {
      setIsLoading(true);
      try {
        const User = await fetchUser();
        setLogeduser(User); 
        await fetchAdmins();
      } catch (error) {
        toast.error("Failed to fetch logged user, logging out...");
        logout(); 
      } finally {
        setIsLoading(false);
      }
    };
    loadAdmins();
  }, [logout]); 

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_BASE_URL}/admin/${formData.id}`, {
        email: formData.email,
        name: formData.name,
      });
      toast.success("Admin updated successfully");
      await fetchAdmins();
      closeModal();
    } catch (error) {
      toast.error("Failed to update admin");
      console.error(error);
    }
  };

  const addNew = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/new`, {
        ...formData,
      });

      if (!response) {
        throw new Error("Failed to add new admin");
      }

      await response.data;
      toast.success("Admin added successfully");
    } catch (error) {
      console.error("Failed to add new admin", error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/delete/${id}`);
      toast.success("Admin deleted successfully");
      await fetchAdmins();
    } catch (error) {
      toast.error("Failed to delete admin");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.id) {
      await handleUpdate();
    } else {
      await addNew();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setFormData({ email: "", name: "", id: "" });
  };

  const openUpdateModal = (admin: AdminType) => {
    setFormData({ email: admin.email, name: admin.name, id: admin._id });
    setIsAddModalOpen(true);
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Admins</h1>
          <button
            onClick={() => {
              setFormData({ email: "", name: "", id: "" });
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add Admin
          </button>
        </div>

        <Modal isOpen={isAddModalOpen} onClose={closeModal}>
          <h2 className="text-xl font-bold mb-4">
            {formData.id ? "Update Admin" : "Add New Admin"}
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full mb-4 p-2 border rounded-md"
              required
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full mb-4 p-2 border rounded-md"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md"
            >
              {formData.id ? "Update Member" : "Add Member"}
            </button>
          </form>
        </Modal>

        <div>
          {admins.map((admin) => (
            <div
              key={admin._id}
              className="m-3 flex flex-col md:flex-row p-2 justify-between border-b-2"
            >
              <div>
                <h1 className="font-bold">
                  {admin.email} 
                </h1>
                <h1 className="text-gray-500">
                  {admin.name?.toLocaleUpperCase() +` (${admin.role?.role})`}
                </h1>
              </div>
              <div className="flex flex-row-reverse gap-2">
                <button
                  onClick={() => handleDelete(admin._id)}
                  className="bg-red-500 p-2 rounded-md text-white font-bold"
                 
                >
                  Delete
                </button>
                <button
                  onClick={() => openUpdateModal(admin)}
                  className="bg-blue-500 p-2 rounded-md text-white font-bold"
                
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      onClick={onClose}
    >
      <div
        className="relative top-20 mx-auto p-5 border w-11/12 sm:w-96 shadow-lg rounded-md bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default withAdminAuth(MembersPage);
