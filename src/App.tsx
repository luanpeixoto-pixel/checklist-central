import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

// Pages
import Cockpit from "./pages/Cockpit";
import Checklist from "./pages/Checklist";
import Vehicles from "./pages/Vehicles";
import Maintenance from "./pages/Maintenance";
import Fuel from "./pages/Fuel";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnalyticsProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Cockpit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checklist" 
              element={
                <ProtectedRoute>
                  <Checklist />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/veiculos" 
              element={
                <ProtectedRoute>
                  <Vehicles />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manutencao" 
              element={
                <ProtectedRoute>
                  <Maintenance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/combustivel" 
              element={
                <ProtectedRoute>
                  <Fuel />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnalyticsProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
