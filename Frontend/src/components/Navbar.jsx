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
    <nav className="backdrop-blur-md bg-teal-950/80 border-b border-teal-500/20 shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Stethoscope className="h-8 w-8 text-teal-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xl font-bold text-white hidden sm:block tracking-wide group-hover:text-teal-200 transition-colors duration-300">MediCare AI</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {!user && (
              <Link to="/" className="text-white/80 hover:text-teal-300 hover:bg-white/5 py-2 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1.5" title="Home">
                <Home className="h-4 w-4" />
                <span className="hidden lg:inline text-sm font-medium">Home</span>
              </Link>
            )}
            {user && (
              <Link to="/dashboard" className="text-white/80 hover:text-teal-300 hover:bg-white/5 py-2 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1.5" title="Dashboard">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden lg:inline text-sm font-medium">Dashboard</span>
              </Link>
            )}
            <Link to="/chatbot" className="text-white/80 hover:text-teal-300 hover:bg-white/5 py-2 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1.5" title="AI Chatbot">
              <Bot className="h-4 w-4" />
              <span className="hidden lg:inline text-sm font-medium">AI Chatbot</span>
            </Link>
            <Link to="/reports" className="text-white/80 hover:text-teal-300 hover:bg-white/5 py-2 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1.5" title="Reports">
              <FileBarChart className="h-4 w-4" />
              <span className="hidden lg:inline text-sm font-medium">Reports</span>
            </Link>
            <Link to="/news" className="text-white/80 hover:text-teal-300 hover:bg-white/5 py-2 px-3 rounded-lg transition-all duration-200 flex items-center space-x-1.5" title="Health News">
              <Rss className="h-4 w-4" />
              <span className="hidden lg:inline text-sm font-medium">Health News</span>
            </Link>
            <div className="flex items-center space-x-3 ml-2 lg:ml-4 pl-2 lg:pl-4 border-l border-white/10">
              {user ? (
                <>
                  <span className="text-teal-100 flex items-center bg-white/5 py-1 px-3 rounded-full border border-teal-500/20 text-sm">
                    <UserCircle className="h-4 w-4 mr-1.5 text-teal-300" />
                    <span className="hidden lg:inline max-w-[100px] truncate">{user.name}</span>
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1.5 text-white/80 hover:text-rose-400 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition-all duration-200"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden lg:inline text-sm font-medium">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="flex items-center space-x-1.5 text-white/80 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-lg transition-all duration-200"
                    title="Sign In"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden lg:inline text-sm font-medium">Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-400 hover:to-emerald-400 shadow-md shadow-teal-900/30 px-4 py-1.5 rounded-lg transition-all duration-200 font-medium"
                    title="Sign Up"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden lg:inline text-sm font-medium">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-teal-200 hover:text-white p-2 rounded-lg hover:bg-white/5 transition"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-teal-950/95 backdrop-blur-md border-t border-teal-500/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!user && (
              <Link
                to="/"
                className="flex items-center space-x-2 px-3 py-2 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                <Home className="h-4 w-4 text-teal-400" />
                <span>Home</span>
              </Link>
            )}
            {user && (
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-3 py-2 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4 text-teal-400" />
                <span>Dashboard</span>
              </Link>
            )}
            <Link
              to="/chatbot"
              className="flex items-center space-x-2 px-3 py-2 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              <Bot className="h-4 w-4 text-teal-400" />
              <span>AI Chatbot</span>
            </Link>
            <Link
              to="/reports"
              className="flex items-center space-x-2 px-3 py-2 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              <FileBarChart className="h-4 w-4 text-teal-400" />
              <span>Reports</span>
            </Link>
            <Link
              to="/news"
              className="flex items-center space-x-2 px-3 py-2 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              <Rss className="h-4 w-4 text-teal-400" />
              <span>Health News</span>
            </Link>
            {user ? (
              <>
                <div className="px-3 py-2 text-teal-200 flex items-center space-x-2 border-t border-teal-500/20 mt-2 pt-2">
                  <UserCircle className="h-5 w-5 text-teal-400" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg w-full text-left transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="border-t border-teal-500/20 mt-2 pt-2">
                <Link
                  to="/signin"
                  className="flex items-center space-x-2 px-3 py-2 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="h-4 w-4 text-teal-400" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center space-x-2 px-3 py-2 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition"
                  onClick={() => setIsOpen(false)}
                >
                  <UserPlus className="h-4 w-4 text-teal-400" />
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

