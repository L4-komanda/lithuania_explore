import React from "react";
import { FaYoutube, FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

// Footer component with centered content organization
const Footer: React.FC = () => {
  // Array of navigation links for the first ro
  /*
  const navLinks = [
    { name: "Privatumo politika", href: "/legal" },
    { name: "Apie mus", href: "/about" },
  ]; */

  // Array of social media icons for the second row
  const socialLinks = [
    { name: "Youtube", icon: FaYoutube, href: "https://youtube.com" },
    { name: "Facebook", icon: FaFacebookF, href: "https://facebook.com" },
    { name: "Instagram", icon: FaInstagram, href: "https://instagram.com" },
    { name: "X", icon: FaXTwitter, href: "https://x.com" },
  ];

  return (
    <footer className="bg-[#4ed07e] py-4 mt-auto hidden md:block">
      {/* Container to center all content */}
      <div className="container mx-auto px-2">
        
        {/* First row: Navigation links
        <div className="flex justify-center mb-6">
          <nav>
            <ul className="flex flex-wrap justify-center gap-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-white hover:text-gray-900 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div> */}
        
        {/* Second row: Social media icons */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${social.name} page`}
                className="text-white hover:text-gray-900 transition-colors"
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>
        </div>
        
        {/* Third row: Copyright text */}
        <div className="text-center text-white text-sm">
          <p>© 2025, Keliauk.lt, Visos teisės saugomos</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;