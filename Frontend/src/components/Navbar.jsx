import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, Menu, X, UserCircle, Home, Bot, FileBarChart, Rss, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/signin');
  };

  return (
    <nav className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">MediCare AI</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white/90 hover:text-white transition flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/dashboard" className="text-white/90 hover:text-white transition flex items-center space-x-1">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/chatbot" className="text-white/90 hover:text-white transition flex items-center space-x-1">
              <Bot className="h-4 w-4" />
              <span>AI Chatbot</span>
            </Link>
            <Link to="/reports" className="text-white/90 hover:text-white transition flex items-center space-x-1">
              <FileBarChart className="h-4 w-4" />
              <span>Reports</span>
            </Link>
            <Link to="/news" className="text-white/90 hover:text-white transition flex items-center space-x-1">
              <Rss className="h-4 w-4" />
              <span>Health News</span>
            </Link>
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-white/30">
              {user ? (
                <>
                  <span className="text-white/90 flex items-center">
                    <UserCircle className="h-5 w-5 mr-1" />
                    {user.name}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-white/90 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition"
                    title="Sign Out"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="flex items-center space-x-1 text-white/90 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-1 bg-white text-teal-600 hover:bg-white/90 px-3 py-1.5 rounded-lg transition font-medium"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-white/80"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-teal-600 to-teal-700 border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-white/10 rounded"
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-white/10 rounded"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/chatbot"
              className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-white/10 rounded"
              onClick={() => setIsOpen(false)}
            >
              <Bot className="h-4 w-4" />
              <span>AI Chatbot</span>
            </Link>
            <Link
              to="/reports"
              className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-white/10 rounded"
              onClick={() => setIsOpen(false)}
            >
              <FileBarChart className="h-4 w-4" />
              <span>Reports</span>
            </Link>
            <Link
              to="/news"
              className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-white/10 rounded"
              onClick={() => setIsOpen(false)}
            >
              <Rss className="h-4 w-4" />
              <span>Health News</span>
            </Link>
            {user ? (
              <>
                <div className="px-3 py-2 text-white/80 flex items-center space-x-2 border-t border-white/20 mt-2 pt-2">
                  <UserCircle className="h-5 w-5" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-white/10 rounded w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="border-t border-white/20 mt-2 pt-2">
                <Link
                  to="/signin"
                  className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-white/10 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center space-x-2 px-3 py-2 text-white hover:bg-white/10 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

