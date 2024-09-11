"use client";

import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { toast } from "react-toastify";
import withAdminAuth from "@/components/withAdminAuth";
import axios from "axios";
import API_BASE_URL from "@/config/baseURL";

interface TeamMember {
  _id: string;
  email: string;
  isSuperAdmin: boolean;
}

const MembersPage: React.FC = () => {
  const [admins, setAdmins] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [email, setEmail] = useState("");

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/admins`);
      setAdmins(response.data.admins);
    } catch (error) {
      console.error("Failed to fetch admins", error);
    }
  };

  useEffect(() => {
    const loadAdmins = async () => {
      setIsLoading(true);
      try {
        await fetchAdmins();
      } catch (error) {
        toast.error("Failed to fetch team data");
      } finally {
        setIsLoading(false);
      }
    };
    loadAdmins();
  }, []);

  const addNew = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to add new admin");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to add new admin", error);
      throw error;
    }
  };
  const handleDelete  = async (id:string)=>{
   try {
      await axios.delete(`${API_BASE_URL}/admin/delete/${id}`);
    toast.success('admin deleted succesfully')
   await fetchAdmins()
   } catch (error) {
    toast.error('failed to delete admnin')
   }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addNew();
      await fetchAdmins();
      closeModal();
      toast.success("Admin added successfully");
    } catch (error: any) {
      toast.error(`Failed to add admin`);
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Admins</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Add Admin
          </button>
        </div>

        <Modal isOpen={isAddModalOpen} onClose={closeModal}>
          <h2 className="text-xl font-bold mb-4">Add New Admin</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="w-full mb-4 p-2 border rounded-md"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md"
            >
              Add Member
            </button>
          </form>
        </Modal>

        <div className="">
          {admins.map((admin) => (
            <div
              key={admin._id}
              className="m-3 flex p-2 justify-between border-b-2"
            >
              <h1 className="font-bold">
                {admin.email} {admin.isSuperAdmin ? "(Super Admin)" : ""}
              </h1>
              <button

               onClick={()=>handleDelete(admin._id)}
               className="md:bg-red-500 p-2 rounded-md md:text-white text-red-500 font-bold">
                delete
              </button>
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
        className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default withAdminAuth(MembersPage);
