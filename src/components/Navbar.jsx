import { useState } from "react";
import { Menu, X, PlusCircle, Bell, Search, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sample user data - you would get this from your auth context/state
  const user = {
    name: "John Doe",
    role: "Project Manager",
    avatar: null
  };

  const handleLogout = () => {
    // Implement logout logic here
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
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              {/* <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActiveLink("/dashboard")
                    ? "bg-gray-100 text-[#01a370]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                Dashboard
              </Link> */}
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
          </div>

          {/* Right section - Search, actions, and user menu */}
          <div className="flex items-center">
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
              <div className="ml-3 relative">
                <div>
                  <button
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01a370]"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    {user.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatar}
                        alt="User avatar"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[#01a370] flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </button>
                </div>

                {isProfileDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>

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
            {/* <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveLink("/dashboard")
                  ? "bg-gray-100 text-[#01a370]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              Dashboard
            </Link> */}
            <Link
              to="/projects"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveLink("/projects")
                  ? "bg-gray-100 text-[#01a370]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              Projects
            </Link>
            <Link
              to="/issues"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveLink("/issues")
                  ? "bg-gray-100 text-[#01a370]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              Issues
            </Link>
            <Link
              to="/reports"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActiveLink("/reports")
                  ? "bg-gray-100 text-[#01a370]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;