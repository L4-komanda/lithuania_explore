import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogInIcon, Eye, EyeOff } from "lucide-react";

const LogInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });

  useEffect(() => {
    localStorage.setItem("loggedIn", loggedIn.toString());
  }, [loggedIn]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email) {
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Įveskite savo el. pašto adresą",
      });
      return;
    }

    if (!email.includes("@")) {
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Įveskite teisingą el. pašto adresą",
      });
      return;
    }

    if (!password) {
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Įveskite slaptažodį",
      });
      return;
    }

    if (password != "test123") {
      toast({
        variant: "destructive",
        title: "Klaida",
        description: "Neteisingi prisijungimo duomenys",
      });
      return;
    }

    setLoggedIn(true);

    navigate("/waiting");
  };
  const handleRegister = () => {
    navigate("/register");
  };
  const handleForgotPassword = () => {
    navigate("/forgotpassword");
  };

  return (
    <div className="pt-24 pb-0 animate-fade-in">
      <div className="flex-grow flex items-center justify-center bg-white px-4 py-12">
        <div className="max-w-md w-full mx-auto rounded-lg p-8 bg-green-50 shadow-md animate-slide-in">
          <div className="flex justify-center mb-6">
            <div className="bg-lime rounded-full p-3 border-2 border-[#4d9560]">
              <LogInIcon className="h-8 w-8 text-[#4d9560]" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Prisijungimas</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                El. pašto adresas
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="vardenis.pav@gmail.com"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Slaptažodis
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-blue-500 text-sm hover:underline"
              >
                Pamiršau slaptažodį
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#4ed07e] hover:bg-[#22c55e] hover:scale-105"
            >
              Prisijungti
            </button>
          </form>

          {/* Registration link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Neturite paskyros?{" "}
              <button
                onClick={handleRegister}
                className="text-blue-500 hover:underline"
              >
                Registruotis
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
