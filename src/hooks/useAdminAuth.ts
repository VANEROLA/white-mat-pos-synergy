
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface AdminAuthState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

export const useAdminAuth = (): AdminAuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Initialize state from localStorage on mount
    try {
      const adminAuthToken = localStorage.getItem("adminAuthToken");
      if (adminAuthToken) {
        const tokenData = JSON.parse(adminAuthToken);
        const currentTime = new Date().getTime();
        return tokenData.expiry > currentTime;
      }
    } catch (error) {
      console.error("Error checking initial auth state:", error);
    }
    return false;
  });
  
  const location = useLocation();

  // Set up regular token expiry check
  useEffect(() => {
    const checkAuth = () => {
      try {
        const adminAuthToken = localStorage.getItem("adminAuthToken");
        if (adminAuthToken) {
          const tokenData = JSON.parse(adminAuthToken);
          const currentTime = new Date().getTime();
          
          console.log("Auth check: Token expiry:", new Date(tokenData.expiry).toLocaleTimeString());
          console.log("Auth check: Current time:", new Date(currentTime).toLocaleTimeString());
          
          if (tokenData.expiry > currentTime) {
            setIsAuthenticated(true);
          } else {
            // Clear expired token
            console.log("Auth check: Token expired, logging out");
            localStorage.removeItem("adminAuthToken");
            setIsAuthenticated(false);
          }
        } else {
          if (isAuthenticated) {
            console.log("Auth check: No token found but state is authenticated, resetting");
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Error checking auth token:", error);
        localStorage.removeItem("adminAuthToken");
        setIsAuthenticated(false);
      }
    };

    // Initial check
    checkAuth();
    
    // Set up interval for regular checks
    const intervalId = setInterval(checkAuth, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  // Reset authentication when navigating away from admin page
  useEffect(() => {
    if (!location.pathname.includes("/admin") && isAuthenticated) {
      console.log("Leaving admin area, logging out");
      logout();
    }
  }, [location.pathname, isAuthenticated]);

  // Login function with improved state management
  const login = (password: string): boolean => {
    console.log("Login attempt");
    // Get the stored admin password or use the default if not set
    const storedPassword = localStorage.getItem("adminPassword") || "1234";
    
    if (password === storedPassword) {
      console.log("Password correct, creating token");
      // Set authentication token with 2-hour expiry
      const expiryTime = new Date().getTime() + (2 * 60 * 60 * 1000); // 2 hours
      const tokenData = { expiry: expiryTime };
      
      localStorage.setItem("adminAuthToken", JSON.stringify(tokenData));
      console.log("Setting authenticated state to true");
      setIsAuthenticated(true);
      return true;
    }
    
    console.log("Password incorrect");
    return false;
  };

  // Logout function with immediate state update
  const logout = (): void => {
    console.log("Logout called");
    localStorage.removeItem("adminAuthToken");
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    logout
  };
};
