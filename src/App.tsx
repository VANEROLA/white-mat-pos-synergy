
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import AddProduct from "@/pages/AddProduct";
import OrderHistory from "@/pages/OrderHistory";
import SystemLogs from "@/pages/SystemLogs";
import FreeItems from "@/pages/FreeItems";
import InventoryManagement from "@/pages/InventoryManagement";
import AdminSettings from "@/pages/AdminSettings";
import Options from "@/pages/Options";
import StoreLogin from "@/pages/StoreLogin";
import NotFound from "@/pages/NotFound";
import SalesData from "@/pages/SalesData";
import StoreSalesComparison from "@/pages/StoreSalesComparison";
import "./App.css";
import { TaxProvider } from "@/contexts/TaxContext";
import React, { useState } from "react";
import SidebarMenu from "@/components/SidebarMenu";
import { StoreAuthProvider, useStoreAuthContext } from "@/contexts/StoreAuthContext";
import "@/styles/options.css"; // Import the options CSS file for dark mode

// 認証が必要なルートを保護するためのラッパー
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useStoreAuthContext();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated } = useStoreAuthContext();

  const toggleMenu = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <TaxProvider>
      <div className="flex min-h-screen">
        <div className="flex-1">
          {/* Sidebar activated by hamburger menu for all devices */}
          {isAuthenticated && (
            <SidebarMenu 
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              onNavigate={() => setIsSidebarOpen(false)}
              toggleMenu={toggleMenu}
            />
          )}

          <Routes>
            <Route path="/login" element={<StoreLogin />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index 
                  toggleMenu={toggleMenu} 
                  isMenuOpen={isSidebarOpen} 
                />
              </ProtectedRoute>
            } />
            <Route path="/add-product" element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            } />
            <Route path="/order-history" element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            } />
            <Route path="/system-logs" element={
              <ProtectedRoute>
                <SystemLogs />
              </ProtectedRoute>
            } />
            <Route path="/free-items" element={
              <ProtectedRoute>
                <FreeItems />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <InventoryManagement />
              </ProtectedRoute>
            } />
            <Route path="/sales-data" element={
              <ProtectedRoute>
                <SalesData 
                  toggleMenu={toggleMenu}
                  isMenuOpen={isSidebarOpen}
                />
              </ProtectedRoute>
            } />
            <Route path="/store-sales-comparison" element={
              <ProtectedRoute>
                <StoreSalesComparison 
                  toggleMenu={toggleMenu}
                  isMenuOpen={isSidebarOpen}
                />
              </ProtectedRoute>
            } />
            <Route path="/options" element={
              <ProtectedRoute>
                <Options />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Toaster />
    </TaxProvider>
  );
}

function App() {
  return (
    <StoreAuthProvider>
      <AppContent />
    </StoreAuthProvider>
  );
}

export default App;
