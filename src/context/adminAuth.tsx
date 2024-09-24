import API_BASE_URL from "@/config/baseURL";
import axios from "axios";

export const fetchUser = async () => {
  try {
    const token = localStorage.getItem("ffa-admin");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_BASE_URL}/admin`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("Fetched user data:", response.data); // Log the fetched data
    return response.data; // Ensure this is the object you expect
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch user data"
    );
  }
};
