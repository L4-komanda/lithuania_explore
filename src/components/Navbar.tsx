
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, MapPin, Flag, Users, AlertTriangle, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
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
  
  const navItems = [
    { name: 'Žemėlapis', path: '/', icon: MapPin },
    { name: 'Lenktynės', path: '/races', icon: Flag },
    { name: 'Draugai', path: '/friends', icon: Users },
    { name: 'Būrimas', path: '/fortune', icon: Moon },
    { name: 'Skundai', path: '/complaints', icon: AlertTriangle },
    { name: 'Profilis', path: '/profile', icon: User },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out px-4",
        scrolled 
          ? "py-3 bg-white/80 backdrop-blur-lg shadow-sm" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="font-bold text-xl tracking-tight flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="text-primary">Keliauk.lt</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-2 rounded-lg flex items-center gap-2 transition-all",
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "hover:bg-secondary"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          ))}
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
