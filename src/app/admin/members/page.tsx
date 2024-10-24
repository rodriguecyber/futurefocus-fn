"use client";

import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import withAdminAuth from "@/components/withAdminAuth";
import { fetchUser, getLoggedUserData } from "@/context/adminAuth";
import { IUser, TeamMember } from "@/types";
import { hasPermission } from "@/config/hasPermission";
import axios from "axios";
import API_BASE_URL from "@/config/baseURL";

const MembersPage: React.FC = () => {
  const { fetchTeam, addTeamMember, updateTeamMember, deleteTeamMember } =
    useAuth();

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [userData, setUserData] = useState<IUser | null>(null);

  // New state to handle toggles for each member
  const [toggles, setToggles] = useState<{ [key: string]: boolean }>({});

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    image: "",
    role: "",
    position: "",
    email: "",
    instagram: "",
    isAdmin:false
  });

  useEffect(() => {
    const loadTeamMembers = async () => {
      setIsLoading(true);
      try {
        await fetchUser()
        const teamMembers = await fetchTeam();
        setMembers(teamMembers);
        setUserData(getLoggedUserData());

        // Initialize toggles for each member
        const initialToggles: { [key: string]: boolean } = {};
        teamMembers.forEach((member) => {
          initialToggles[member._id] = member.isAdmin; // Set default toggle state
        });
        setToggles(initialToggles);
      } catch (error) {
        toast.error("Failed to fetch team data");
      } finally {
        setIsLoading(false);
      }
    };
    loadTeamMembers();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await updateTeamMember(editingMember._id, formData);
        toast.success("Member updated successfully");
      } else {
        await addTeamMember(formData);
        toast.success("Member added successfully");
      }
      setMembers(await fetchTeam());
      closeModal();
    } catch (error) {
      toast.error(`Failed to ${editingMember ? "update" : "add"} member`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData(member);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTeamMember(id);
      setMembers(members.filter((member) => member._id !== id));
      toast.success("Member deleted successfully");
      const { [id]: _, ...remainingToggles } = toggles;
      setToggles(remainingToggles);
    } catch (error) {
      toast.error("Failed to delete member");
    }
  };

  const handleToggle = async(id: string) => {
    try {
      await axios.put(`${API_BASE_URL}/member/toogle-admin/${id}`);
      setToggles((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } catch (error) {
     toast.error('failed to switch') 
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsUpdateModalOpen(false);
    setEditingMember(null);
    setFormData({
      _id: "",
      name: "",
      image: "",
      role: "",
      position: "",
      email: "",
      instagram: "",
      isAdmin:false
    });
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Team Members</h1>
          <button
            disabled={!hasPermission(userData as IUser, "team", "create")}
            onClick={() => setIsAddModalOpen(true)}
            className={`px-4 py-2 ${
              !hasPermission(userData as IUser, "team", "create")
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600"
            } text-white rounded-md`}
          >
            Add Member
          </button>
        </div>
        {isLoading ? (
          <div className="text-center py-10">
            <div className="loader">Loading...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member._id}
                className="flex items-center p-4 border flex-row rounded-lg shadow-md bg-white"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-gray-700 mb-1">{member.position}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={member._id}
                      className="toggle-checkbox hidden"
                      checked={toggles[member._id] || false}
                      onChange={() => handleToggle(member._id)}
                    />
                    <div
                      onClick={() => handleToggle(member._id)}
                      className={`toggle-container w-16 h-8 rounded-full flex items-center p-1 cursor-pointer ${
                        toggles[member._id] ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`toggle-circle w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          toggles[member._id] ? "translate-x-8" : ""
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex mt-2 flex-col gap-2">
                    <button
                      disabled={
                        !hasPermission(userData as IUser, "team", "update")
                      }
                      onClick={() => handleEdit(member)}
                      className={`px-4 py-2 ${
                        !hasPermission(userData as IUser, "team", "update")
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600"
                      } text-white rounded-md`}
                    >
                      Edit
                    </button>
                    <button
                      disabled={
                        !hasPermission(userData as IUser, "team", "delete")
                      }
                      onClick={() => handleDelete(member._id)}
                      className={`px-4 py-2 ${
                        !hasPermission(userData as IUser, "team", "delete")
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600"
                      } text-white rounded-md`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Modal
          isOpen={isAddModalOpen || isUpdateModalOpen}
          onClose={closeModal}
        >
          <h2 className="text-xl font-bold mb-4">
            {editingMember ? "Edit Member" : "Add New Member"}
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full mb-4 p-2 border rounded-md"
              required
            />
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full mb-4 p-2 border rounded-md"
              required
            />
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Position"
              className="w-full mb-4 p-2 border rounded-md"
              required
            />
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
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="Instagram URL"
              className="w-full mb-4 p-2 border rounded-md"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md"
            >
              {editingMember ? "Update Member" : "Add Member"}
            </button>
          </form>
        </Modal>
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
