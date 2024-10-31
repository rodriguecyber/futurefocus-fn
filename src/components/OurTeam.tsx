"use client";

import { useAuth } from "@/context/AuthContext";
import { TeamMember } from "@/types";
import React, { useEffect, useState } from "react";
import { FaEnvelope, FaInstagram } from "react-icons/fa";
import { toast } from "react-toastify";

const OurTeam = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);

  // Get fetchTeam from useAuth
  const { fetchTeam } = useAuth();

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const teamMembers = await fetchTeam();
        setMembers(teamMembers);
      } catch (error) {
        toast.error("Failed to fetch team data");
      }
    };

    loadTeamMembers();
  }, []); 

  return (
    <div className="text-center">
      <h4 className="text-center text-xl text-cyan-600 mb-6">Meet Our Team</h4>
      <div className="flex flex-wrap justify-center gap-6">
        {members.map((member) => (
          <div
            key={member._id} // Use member._id as the unique key
            className="flex flex-col items-center bg-white rounded-lg overflow-hidden shadow-md w-full sm:w-1/2 md:w-1/3 lg:w-1/5 p-4 hover:border-black hover:border-2"
          >
            <div className="relative w-full">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-auto rounded-t-lg object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 py-2 flex justify-center gap-4">
                <a href={member.instagram} className="text-white">
                  <FaInstagram size={24} />
                </a>
                <a href={`mailto:${member.email}`} className="text-white">
                  <FaEnvelope size={24} />
                </a>
              </div>
            </div>
            <div className="mt-4 text-center">
              <h1 className="text-lg font-semibold">{member.name}</h1>
              <p className="text-gray-500">{member.role.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurTeam;
