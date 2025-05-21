import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Races from "./pages/Races";
import Friends from "./pages/Friends";
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
import { UserActionProvider } from "./lib/UserActionContext"
import { LogIn } from "lucide-react";
import MyRoutes from "./pages/MyRoutes";
import WaitingPage from "./pages/WaitingPage";
import FortunePage from "./pages/Fortune";
import Recommendations from "./pages/Recommendations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <UserActionProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-svh justify-between">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/profile" element={<Profile />} />
              <Route path="/races" element={<Races />} />
              <Route path="/waiting" element={<WaitingPage />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/resetpassword" element={<ResetPasswordPage />} />
              <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
              <Route path="/login" element={<LogInPage />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/" element={<Index />} />
              <Route path="/myroutes" element={<MyRoutes />} />
              <Route path="/editprofile" element={<EditProfile />} /> 
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/fortune" element={<FortunePage />} />
              <Route path="/recommendations" element={<Recommendations />} />


            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
      </UserActionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
