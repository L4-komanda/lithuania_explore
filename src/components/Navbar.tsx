import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, MapPin, Flag, Users, AlertTriangle, Moon, LogIn, UserPlus2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownOpen && !target.closest('.profile-dropdown')) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);
  
  const navItems = [
    { name: 'Pagrindinis', path: '/', icon: MapPin },
    { name: 'Lenktynės', path: '/races', icon: Flag },
    { name: 'Draugai', path: '/friends', icon: Users },
    { name: 'Būrimas', path: '/fortune', icon: Moon },
    { name: 'Skundai', path: '/complaints', icon: AlertTriangle },
  ];

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(prev => !prev);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-[#4ed07e] shadow-sm transition-all duration-300 ease-out px-10 py-3",
      )}
    >
      <div className="max-w-full mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="font-bold text-xl tracking-tight flex items-center gap-2 transition-opacity hover:opacity-80"
        >
           <img src="logo.png" alt = "Keliauk.lt" height="40%" width="40%"/> 
        </Link>
        <nav className="hidden md:flex items-center gap-5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2 rounded-lg flex items-center gap-2 transition-all text-white text-base",
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "hover:bg-[#22c55e]"
              )} 
            >   
              <item.icon className="w-6 h-6" />
              <span>{item.name}</span>
            </Link>
          ))}

          <div className="relative profile-dropdown">
            <div
              onClick={toggleDropdown}
              className={cn(
                "px-3 py-2 rounded-lg flex items-center gap-2 transition-all text-white text-base cursor-pointer",
                location.pathname === '/profile'
                  ? "bg-primary text-white"
                  : "hover:bg-[#22c55e]"
              )}
            >
              <User className="w-6 h-6" />
              <span>Profilis</span>
            </div>
      
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <Link to="/login" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogIn className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    Prisijungti
                  </Link>
                  <Separator className="my-1" />
                  <Link to="/register" className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <UserPlus2 className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                    Registruotis
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
        <nav className="flex md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)] gap-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex-1 py-2 rounded-lg flex flex-col items-center justify-center text-xs transition-all",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 mb-1 transition-transform",
                location.pathname === item.path 
                  ? "scale-110 text-primary" 
                  : "text-muted-foreground"
              )} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
