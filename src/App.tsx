
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Index from "@/pages/Index";
import AddProduct from "@/pages/AddProduct";
import OrderHistory from "@/pages/OrderHistory";
import SystemLogs from "@/pages/SystemLogs";
import NotFound from "@/pages/NotFound";
import "./App.css";
import { TaxProvider } from "@/contexts/TaxContext";
import { ConnectionProvider } from "@/contexts/ConnectionContext";

function App() {
  return (
    <ConnectionProvider>
      <TaxProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/system-logs" element={<SystemLogs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </TaxProvider>
    </ConnectionProvider>
  );
}

export default App;
