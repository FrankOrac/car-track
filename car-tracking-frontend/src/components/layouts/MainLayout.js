import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Icons
import {
  HomeIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  MapIcon,
  BellIcon,
  UserIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
    { name: "Vehicles", path: "/vehicles", icon: TruckIcon },
    { name: "Maintenance", path: "/maintenance", icon: WrenchScrewdriverIcon },
    { name: "Geofences", path: "/geofences", icon: MapIcon },
    { name: "Alerts", path: "/alerts", icon: BellIcon },
    { name: "Profile", path: "/profile", icon: UserIcon },
    { name: "Subscription", path: "/subscription", icon: CreditCardIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="fixed inset-0 flex z-40">
          {/* Sidebar */}
          <div
            className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-in-out duration-300 ${
              isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          <div
            className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transition ease-in-out duration-300 transform ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-2xl font-bold text-blue-600">CarTrack</h1>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  >
                    <item.icon
                      className="mr-4 flex-shrink-0 h-6 w-6"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-base font-medium rounded-md w-full"
                >
                  <ArrowRightOnRectangleIcon
                    className="mr-4 flex-shrink-0 h-6 w-6"
                    aria-hidden="true"
                  />
                  Logout
                </button>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex-shrink-0 group block">
                <div className="flex items-center">
                  <div>
                    <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700">
                      {user?.name}
                    </p>
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-blue-600">CarTrack</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className="mr-3 flex-shrink-0 h-6 w-6"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full"
              >
                <ArrowRightOnRectangleIcon
                  className="mr-3 flex-shrink-0 h-6 w-6"
                  aria-hidden="true"
                />
                Logout
              </button>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </p>
                  <p className="text-xs font-medium text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 pb-8">
          <div className="mt-4 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
