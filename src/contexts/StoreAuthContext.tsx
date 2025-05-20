
import React, { createContext, useContext, ReactNode } from "react";
import { useStoreAuth, StoreAuthState } from "@/hooks/useStoreAuth";

// Create the context with a default value of null
const StoreAuthContext = createContext<StoreAuthState | null>(null);

// Provider component that wraps the application
export const StoreAuthProvider: React.FC<{ children: ReactNode }> = ({ 
  children 
}) => {
  // Use the hook to get auth state and methods
  const auth = useStoreAuth();
  
  // Provide the auth state to the context
  return (
    <StoreAuthContext.Provider value={auth}>
      {children}
    </StoreAuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useStoreAuthContext = (): StoreAuthState => {
  const context = useContext(StoreAuthContext);
  if (!context) {
    throw new Error("useStoreAuthContext must be used within a StoreAuthProvider");
  }
  return context;
};
