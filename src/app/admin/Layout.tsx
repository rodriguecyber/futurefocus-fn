import React, { ReactNode } from "react";
import Link from "next/link";
import withAdminAuth from "@/components/withAdminAuth";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const handleLogout  = ()=>{
    localStorage.removeItem("ffa-admin")
    window.location.href='/admin/login'
  }
  return (
   
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex   justify-between h-16">
            <div className="flex">
              <Link href="/admin" className="flex-shrink-0 flex items-center">
                Admin Panel
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin/members"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                >
                  Members
                </Link>
                <Link
                  href="/admin/students"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                >
                  Students
                </Link>
                <Link
                  href="/admin/services"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                >
                  Services
                </Link>
                <Link
                  href="/admin/courses"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium"
                >
                  Courses
                </Link>
              </div>
            </div>
              <button onClick={handleLogout} className=" text-red-600 hover:text-red-400 p-0 ">Logout</button>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout
