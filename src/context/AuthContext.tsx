import axios from "axios";
import { createContext, ReactNode, useContext, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "@/config/baseURL";

interface Admin {
  email: string;
  password: string;
  isSuperAdmin: boolean;
}

interface TeamMember {
  _id: string;
  name: string;
  image: string;
  role: string;
  email: string;
  instagram: string;
}

interface AuthContextData {
  signed: boolean;
  isLoading: boolean;
  loggedUser: Admin | null;
  login: (user: Admin) => Promise<void>;
  fetchTeam: () => Promise<TeamMember[]>;
  addTeamMember: (newMember: Omit<TeamMember, "_id">) => Promise<void>;
  updateTeamMember: (id: string, updatedMember: TeamMember) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

const AuthContextAPI: React.FC<AuthProviderProps> = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (userData: Admin) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/login`,
        userData,
        { withCredentials: true }
      );
      setLoggedUser(response.data);
      toast.success("Login successful");
      localStorage.setItem("ffa-admin", response.data.token);
      window.location.href = "/admin";
    } catch (error: any) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeam = async (): Promise<TeamMember[]> => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/member`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      handleAxiosError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addTeamMember = async (newMember: Omit<TeamMember, "_id">) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/member/new`,
        newMember,
        { withCredentials: true }
      );
      toast.success("Member added successfully");
      return response.data;
    } catch (error: any) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTeamMember = async (id: string, updatedMember: TeamMember) => {
    setIsLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/member/update/${id}`, updatedMember, {
        withCredentials: true,
      });
      toast.success("Member updated successfully");
    } catch (error: any) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTeamMember = async (id: string) => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/member/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Member deleted successfully");
    } catch (error: any) {
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/admin/logout`,
        {},
        { withCredentials: true }
      );
      setLoggedUser(null);
      localStorage.removeItem("ffa-admin");
      window.location.href = "/admin/login";
    } catch (error: any) {
      handleAxiosError(error);
    }
  };

  const handleAxiosError = (error: any) => {
    console.log("Handling error", error); // Debugging line
    if (axios.isAxiosError(error)) {
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred");
      } else if (error.request) {
        toast.error("Failed to connect to server");
      } else {
        toast.error("Error sending request. Try again.");
      }
    } else {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signed: Boolean(loggedUser),
        isLoading,
        loggedUser,
        login,
        fetchTeam,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        logout,
      }}
    >
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContextAPI;
