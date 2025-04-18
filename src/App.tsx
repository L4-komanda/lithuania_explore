import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import ResetPasswordPage from "./pages/ResetPassword";
import Navbar from "./components/Navbar";
import ForgotPasswordPage from "./pages/ForgotPassword";
import Footer from "./components/Footer";
import LogInPage from "./pages/LogInPage";
import RegisterPage from "./pages/RegisterPage";
import { useEffect, useState } from "react";
import Complaints from "./pages/Complaints";
import Index from "./pages/Index";
import EditProfile from "./pages/EditProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-svh justify-between">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/profile" element={<Profile />} />
              <Route path="/resetpassword" element={<ResetPasswordPage />} />
              <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
              <Route path="/login" element={<LogInPage />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/" element={<Index />} />
              <Route path="/editprofile" element={<EditProfile />} /> 
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
