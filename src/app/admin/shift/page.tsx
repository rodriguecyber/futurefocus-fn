"use client";
import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import API_BASE_URL from "@/config/baseURL";
import axios from "axios";
import { toast } from "react-toastify";
import { IUser } from "@/types";
import { fetchUser, getLoggedUserData } from "@/context/adminAuth";
import { hasPermission } from "@/config/hasPermission";

const Shift = () => {
  const [shift, setShift] = useState({start:"",end:""});
  const [shifts, setShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [userData, setUserData] = useState<IUser>();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
   setShift((prev) => ({
     ...prev,
     [name]: value,
   }));
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await axios.delete(
        `${API_BASE_URL}/others/intake/${id}`
      );
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
      const response = await axios.get(`${API_BASE_URL}/others/shift`);
      setShifts(response.data.shifts);
      await fetchUser();
      setUserData(await getLoggedUserData());
      console.log(userData)
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`${API_BASE_URL}/others/shift`, {
        start:shift.start,
        end:shift.end
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
          <h1 className="text-3xl font-bold mb-4 text-center">Shift</h1>
          <div className="flex gap-3 items-center justify-center">
            <div className=" flex flex-col  gap-2">
              <span className="flex  gap-10 ">
                <p className="w-1/2">START AT:</p>
                <input
                  className="w-1/2"
                  type="time"
                  name="start"
                  id=""
                  onChange={handleChange}
                />
              </span>
              <span className="flex gap-2 ">
                <p className="w-1/2">END AT:</p>
                <input
                  className="w-1/2"
                  type="time"
                  name="end"
                  id=""
                  onChange={handleChange}
                />
              </span>
            </div>
            <button
              disabled={!hasPermission(userData as IUser, "intake", "create")}
              className={`${
                !hasPermission(userData as IUser, "intake", "create")
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-700  hover:bg-blue-500"
              } text-white rounded p-2`}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Add New shift"}
            </button>
          </div>
          <div className="flex flex-col text-center md:w-fit mx-auto border-2 mt-10 border-[#837979] rounded bg-blue-100">
            {isLoading
              ? "Loading..."
              : shifts.length === 0
              ? "No shift found"
              : shifts.map(
                  (shift: { _id: string; start: string; end: string }) => (
                    <div
                      key={shift._id}
                      className="border-b-2 border-[#837979] p-2 flex items-center justify-between gap-4"
                    >
                      <div className="flex flex-col">
                      <p className="text-lg font-bold">START AT</p>
                        <h5>{shift.start}</h5>
                      </div>
                      <div className="flex flex-col">
                      <p className="text-lg font-bold">END AT</p>
                        <h5>{shift.end}</h5>
                      </div>

                      <button
                        disabled={
                          !hasPermission(userData as IUser, "intake", "delete")
                        }
                        onClick={() => handleDelete(shift._id)}
                        className={`${
                          !hasPermission(userData as IUser, "intake", "create")
                            ? "bg-gray-400 cursor-not-allowed"
                            : "lg:bg-red-600 text-red-600"
                        } lg:text-white p-1 rounded`}
                      >
                        {deletingId === shift._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  )
                )}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Shift;
