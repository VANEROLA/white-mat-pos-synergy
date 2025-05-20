
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface AdminAuthState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

export const useAdminAuth = (): AdminAuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkAuth = () => {
      const adminAuthToken = localStorage.getItem("adminAuthToken");
      if (adminAuthToken) {
        try {
          const tokenData = JSON.parse(adminAuthToken);
          const currentTime = new Date().getTime();
          
          // If token has not expired, authenticate the user
          if (tokenData.expiry > currentTime) {
            setIsAuthenticated(true);
          } else {
            // Clear expired token
            localStorage.removeItem("adminAuthToken");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error parsing auth token:", error);
          localStorage.removeItem("adminAuthToken");
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
    
    // Set up an interval to check token expiry regularly
    const intervalId = setInterval(checkAuth, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

  // Reset authentication when navigating away from admin page
  useEffect(() => {
    if (!location.pathname.includes("/admin") && isAuthenticated) {
      logout();
    }
  }, [location.pathname, isAuthenticated]);

  // Login function that validates the password
  const login = (password: string): boolean => {
    // Get the stored admin password or use the default if not set
    const storedPassword = localStorage.getItem("adminPassword") || "1234";
    
    if (password === storedPassword) {
      // Set authentication token with 2-hour expiry
      const expiryTime = new Date().getTime() + (2 * 60 * 60 * 1000); // 2 hours
      localStorage.setItem("adminAuthToken", JSON.stringify({
        expiry: expiryTime
      }));
      
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem("adminAuthToken");
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    logout
  };
};
