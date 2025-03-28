import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000/api";

// Create an auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize axios with token
  const initializeAxios = (token) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // Clear axios token
  const clearAxiosToken = () => {
    delete axios.defaults.headers.common["Authorization"];
  };

  // Initialize auth state from localStorage on startup
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        initializeAxios(token);

        // Verify the token is still valid by fetching user data
        fetchUser(token).catch(() => {
          // If token is invalid, log out
          logout();
        });
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        logout();
      }
    }

    setLoading(false);
  }, []);

  // Fetch current user data
  const fetchUser = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  // Register a new user
  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      initializeAxios(token);
      setUser(user);
      setIsAuthenticated(true);

      toast.success("Registration successful!");
      return user;
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Registration failed");
      } else {
        toast.error("Registration failed. Please try again.");
      }

      throw error;
    }
  };

  // Login a user
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      initializeAxios(token);
      setUser(user);
      setIsAuthenticated(true);

      toast.success("Login successful!");
      return user;
    } catch (error) {
      console.error("Login error:", error);

      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Login failed");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }

      throw error;
    }
  };

  // Logout a user
  const logout = async () => {
    try {
      if (isAuthenticated) {
        await axios.post(`${API_URL}/logout`);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage and state regardless of API success/failure
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      clearAxiosToken();
      setUser(null);
      setIsAuthenticated(false);

      toast.info("You have been logged out.");
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await axios.put(`${API_URL}/user`, userData);

      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully!");
      return updatedUser;
    } catch (error) {
      console.error("Update profile error:", error);

      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Failed to update profile");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }

      throw error;
    }
  };

  // Context value
  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
