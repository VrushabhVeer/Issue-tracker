import { useState, useEffect, useRef } from "react";
import { Menu, X, PlusCircle, Bell, Search, User, LogOut, Settings, User as UserIcon } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import UserAvatar from '../common/UserAvatar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get real user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  const user = storedUser || {
    name: "Guest",
    role: "User",
    email: "",
    avatar: null
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log("User logged out");
    navigate("/login");
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section - Logo and navigation links */}
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="font-bebasNeue text-2xl text-[#01a370] tracking-wide">
                IssueTracker
              </span>
            </Link>

            {/* Desktop navigation links */}
            {isAuthenticated && (
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                <Link
                  to="/projects"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActiveLink("/projects")
                    ? "bg-gray-100 text-[#01a370]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  Projects
                </Link>
                <Link
                  to="/issues"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActiveLink("/issues")
                    ? "bg-gray-100 text-[#01a370]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  Issues
                </Link>
                <Link
                  to="/reports"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActiveLink("/reports")
                    ? "bg-gray-100 text-[#01a370]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  Reports
                </Link>
              </div>
            )}
          </div>

          {/* Right section - Search, actions, and user menu */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                {/* Search bar */}
                <div className="hidden md:block">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search issues, projects..."
                      className="block w-56 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#01a370] focus:border-[#01a370] text-sm"
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="ml-4 flex items-center md:ml-6">
                  <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01a370]">
                    <PlusCircle className="h-5 w-5" />
                    <span className="sr-only">Create new</span>
                  </button>

                  <button className="ml-2 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01a370]">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">View notifications</span>
                  </button>

                  {/* Profile dropdown */}
                  <div className="ml-3 relative" ref={dropdownRef}>
                    <div>
                      <button
                        className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01a370] transition-all duration-200 hover:scale-105"
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      >
                        <span className="sr-only">Open user menu</span>
                        <UserAvatar user={user} size="medium" />
                      </button>
                    </div>

                    {isProfileDropdownOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-2xl py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                          <div className="flex items-center space-x-3">
                            <UserAvatar user={user} size="medium" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                              <p className="text-xs text-gray-500 truncate">{user.email || 'No email provided'}</p>
                            </div>
                          </div>
                          <div className="mt-2 text-[10px] uppercase font-bold tracking-wider text-[#01a370] bg-[#ebf9f4] px-2 py-0.5 rounded-full inline-block">
                            {user.role}
                          </div>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#01a370] transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <UserIcon className="mr-3 h-4 w-4" />
                            Your Profile
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#01a370] transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <Settings className="mr-3 h-4 w-4" />
                            Settings
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 pt-1 mt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                          >
                            <LogOut className="mr-3 h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#01a370] hover:bg-[#018a60] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01a370]"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center ml-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01a370]"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {isAuthenticated ? (
              <>
                <Link
                  to="/projects"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveLink("/projects")
                    ? "bg-gray-100 text-[#01a370]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Projects
                </Link>
                <Link
                  to="/issues"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveLink("/issues")
                    ? "bg-gray-100 text-[#01a370]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Issues
                </Link>
                <Link
                  to="/reports"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveLink("/reports")
                    ? "bg-gray-100 text-[#01a370]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Reports
                </Link>

                {/* Mobile search */}
                <div className="px-3 py-2">
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search issues, projects..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#01a370] focus:border-[#01a370] text-sm"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-5">
                    <UserAvatar user={user} size="medium" />
                    <div className="ml-3 font-medium">
                      <div className="text-base text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-[#01a370] hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
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