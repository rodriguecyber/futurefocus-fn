"use client";
import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import API_BASE_URL from "@/config/baseURL";
import axios from "axios";
import { toast } from "react-toastify";

const Shift = () => {
  const [intake, setIntake] = useState("");
  const [intakes, setIntakes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long" } as const;
    return date.toLocaleDateString("en-US", options);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntake(formatDate(e.target.value));
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await axios.delete(`${API_BASE_URL}/admin/intake/${id}`);
      await getIntakes();
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const getIntakes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/intake`);
      setIntakes(response.data.intakes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`${API_BASE_URL}/admin/intake`, {
        intake: intake,
      });
      toast.success(response.data.message);
      await getIntakes();
    } catch (error) {
      toast.error("Failed to add intake");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getIntakes();
  }, []);

  return (
    <div>
      <Layout>
        <div className="">
          <h1 className="text-3xl font-bold mb-4 text-center">Intakes</h1>
          <div className="flex gap-3 justify-center">
            <input type="month" name="" id="" onChange={handleChange} />
            <button
              className="bg-blue-700 rounded p-2 hover:bg-blue-500 text-white"
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Add New INTAKE"}
            </button>
          </div>
          <div className="flex flex-col text-center md:w-fit mx-auto border-2 mt-10 border-[#837979] rounded bg-blue-100">
            {isLoading
              ? "Loading..."
              : intakes.length === 0
              ? "No intake found"
              : intakes.map((intake: { _id: string; intake: string }) => (
                  <div
                    key={intake._id}
                    className="border-b-2 border-[#837979] p-2 flex justify-between gap-4"
                  >
                    <h5>{intake.intake}</h5>
                    <button
                      onClick={() => handleDelete(intake._id)}
                      className="lg:bg-red-600 text-red-600 lg:text-white p-1 rounded"
                    >
                      {deletingId === intake._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Shift;