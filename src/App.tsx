
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import AddProduct from "@/pages/AddProduct";
import OrderHistory from "@/pages/OrderHistory";
import SystemLogs from "@/pages/SystemLogs";
import FreeItems from "@/pages/FreeItems";
import InventoryManagement from "@/pages/InventoryManagement";
import NotFound from "@/pages/NotFound";
import "./App.css";
import { TaxProvider } from "@/contexts/TaxContext";
import React, { useState } from "react";
import SidebarMenu from "@/components/SidebarMenu";
import HamburgerMenu from "@/components/HamburgerMenu";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <TaxProvider>
      <div className="flex min-h-screen">
        {/* Desktop sidebar - only visible on larger screens */}
        <div className="hidden md:block w-64 border-r min-h-screen">
          <SidebarMenu className="p-4" />
        </div>

        <div className="flex-1">
          {/* Hamburger menu - visible on mobile devices */}
          <div className="p-4 flex items-center md:hidden">
            <HamburgerMenu 
              isOpen={isSidebarOpen} 
              toggleMenu={() => setIsSidebarOpen(!isSidebarOpen)} 
            />
          </div>

          {/* Mobile sidebar activated by hamburger menu */}
          <SidebarMenu 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onNavigate={() => setIsSidebarOpen(false)}
            currentRoute="/"
          />

          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/system-logs" element={<SystemLogs />} />
            <Route path="/free-items" element={<FreeItems />} />
            <Route path="/inventory" element={<InventoryManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <Toaster />
    </TaxProvider>
  );
}

export default App;
