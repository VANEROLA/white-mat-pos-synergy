
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import AddProduct from "@/pages/AddProduct";
import OrderHistory from "@/pages/OrderHistory";
import SystemLogs from "@/pages/SystemLogs";
import FreeItems from "@/pages/FreeItems";
import InventoryManagement from "@/pages/InventoryManagement";
import AdminSettings from "@/pages/AdminSettings";
import NotFound from "@/pages/NotFound";
import "./App.css";
import { TaxProvider } from "@/contexts/TaxContext";
import React, { useState } from "react";
import SidebarMenu from "@/components/SidebarMenu";
import { useIsMobile } from "@/hooks/use-mobile";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <TaxProvider>
      <div className="flex min-h-screen">
        {/* Remove the permanent sidebar that was taking up space */}
        
        <div className="flex-1">
          {/* Hamburger menu moved to POSHeader component */}

          {/* Sidebar activated by hamburger menu for all devices */}
          <SidebarMenu 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onNavigate={() => setIsSidebarOpen(false)}
            currentRoute={location.pathname}
          />

          <Routes>
            <Route path="/" element={<Index toggleMenu={() => setIsSidebarOpen(!isSidebarOpen)} isMenuOpen={isSidebarOpen} />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/system-logs" element={<SystemLogs />} />
            <Route path="/free-items" element={<FreeItems />} />
            <Route path="/inventory" element={<InventoryManagement />} />
            <Route path="/admin" element={<AdminSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Toaster />
    </TaxProvider>
  );
}

export default App;
