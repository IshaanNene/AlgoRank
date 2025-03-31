import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useTheme } from '../main';
import { 
  Menu, 
  X, 
  Home, 
  Layout, 
  Award, 
  Code, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  Search,
  Bell 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useUser();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Home, public: true },
    { name: "Problems", href: "/problems", icon: Code, protected: true },
    { name: "Dashboard", href: "/dashboard", icon: Layout, protected: true },
    { name: "Profile", href: "/profile", icon: User, protected: true },
    { name: "Leaderboard", href: "/leaderboard", icon: Award, public: true }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all ${isScrolled ? "bg-black/80 shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur-sm" />
            <div className="relative bg-black rounded-lg p-2">
              <Code className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
            CodePro
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-4">
          {navigation.map((item) =>
            (item.public || user) && (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.href ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-indigo-500 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            )
          )}
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-700 focus:outline-none">
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-300" />}
          </button>
          {user && (
            <button onClick={logout} className="p-2 rounded-full hover:bg-gray-700 focus:outline-none">
              <LogOut className="w-5 h-5 text-gray-300" />
            </button>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen((prev) => !prev)} className="p-2 rounded-full text-gray-300 hover:bg-gray-700 focus:outline-none">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/80 backdrop-blur-lg border-t border-gray-700"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) =>
                (item.public || user) && (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-indigo-500 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;