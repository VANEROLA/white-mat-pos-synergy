
import React, { createContext, useContext } from "react";
import { useStoreAuth, StoreAuthState } from "@/hooks/useStoreAuth";

const StoreAuthContext = createContext<StoreAuthState | null>(null);

export const StoreAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const storeAuth = useStoreAuth();
  
  return (
    <StoreAuthContext.Provider value={storeAuth}>
      {children}
    </StoreAuthContext.Provider>
  );
};

export const useStoreAuthContext = (): StoreAuthState => {
  const context = useContext(StoreAuthContext);
  if (!context) {
    throw new Error("useStoreAuthContext must be used within a StoreAuthProvider");
  }
  return context;
};
