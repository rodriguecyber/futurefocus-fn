"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AuthContextAPI from "@/context/AuthContext";
import "./globals.css";

interface LayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsAdmin(pathname?.startsWith("/admin") ?? false);
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        <AuthContextAPI>
              <main>{children}</main>
          
        </AuthContextAPI>
      </body>
    </html>
  );
};

export default RootLayout;
