'use client'
import React, { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl  px-4 sm:px-6 lg:px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <Link href="/admin" className="flex-shrink-0 flex items-center">
                Admin Panel
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/admin/members" className="nav-link">
                  Members
                </Link>
                <Link href="/admin/services" className="nav-link">
                  Services
                </Link>
                <Link href="/admin/courses" className="nav-link">
                  Courses
                </Link>
                <Link href="/admin/admins" className="nav-link">
                  Admins
                </Link>
                <Link href="/admin/intakes" className="nav-link">
                  Intakes
                </Link>
                <Link href="/admin/manage-role" className="nav-link">
                  Roles
                </Link>
                <Link
                  href="https://student.futurefocus.co.rw/"
                  className="text-green-700"
                >
                  Academic Portal
                </Link>
              </div>
            </div>
            <div className="flex items-center sm:hidden">
              <button onClick={toggleMobileMenu} aria-label="Toggle menu">
                {/* Simple hamburger icon */}
                <div className="flex flex-col justify-center items-center">
                  <span className="block w-6 h-1 bg-gray-900 mb-1"></span>
                  <span className="block w-6 h-1 bg-gray-900 mb-1"></span>
                  <span className="block w-6 h-1 bg-gray-900"></span>
                </div>
              </button>
            </div>
            <div className="flex gap-5">
  
              <button
                onClick={handleLogout}
                className="md:bg-red-600 md:text-white rounded md:p-2 z-50 font-extrabold  hover:bg-red-800 text-red-600  "
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white shadow-md">
          <div className="flex flex-col space-y-2 px-4 py-2">
            <Link href="/admin/members" className="nav-link">
              Members
            </Link>
            <Link href="/admin/services" className="nav-link">
              Services
            </Link>
            <Link href="/admin/courses" className="nav-link">
              Courses
            </Link>
            <Link href="/admin/admins" className="nav-link">
              Admins
            </Link>
            <Link href="/admin/intakes" className="nav-link">
              Intakes
            </Link>
            <Link
              href="https://student.futurefocus.co.rw/"
              className="text-green-700"
            >
              Academic Portal
            </Link>
          </div>
        </div>
      )}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
