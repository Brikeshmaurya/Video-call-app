import axios from "axios";
import httpStatus from "http-status";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";



export const AuthContext = createContext({});


// Axios instance
console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const router = useNavigate();

  // Register function
  const handleRegister = async (name, username, password) => {
    try {
      const response = await client.post("/register", {
        name,
        username,
        password,
      });

      if (response.status === httpStatus.CREATED) {
        return response.data.message;
      }
    } catch (err) {
      console.error("Register Error:", err);
      throw err;
    }
  };

  // Login function
  const handleLogin = async (username, password) => {
    try {
      const response = await client.post("/login", {
        username,
        password,
      });

      console.log("Login response:", response.data);

      if (response.status === httpStatus.OK) {
        localStorage.setItem("token", response.data.token);
        setUserData(response.data.user);
        router("/home");
      }
    } catch (err) {
      console.error("Login Error:", err);
      throw err;
    }
  };

  // Add to user history
  const addToUserHistory = async (meetingCode) => {
    try {
      const token = localStorage.getItem("token");
      const response = await client.post(
        "/add_to_activity",
        { meetingCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Add to history error:", err);
      throw err;
    }
  };

  // Get user meeting history
  const getHistoryOfUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await client.get("/get_all_activity", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.history;
    } catch (err) {
      console.error("Get history error:", err);
      throw err;
    }
  };

  // Provide everything to context
  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    addToUserHistory,
    getHistoryOfUser,
  };

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );
};
