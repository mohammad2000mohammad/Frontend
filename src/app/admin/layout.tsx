"use client"
import { ReactNode, useEffect, useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token); // Set auth status based on token presence
  }, []);

  const handleLogin = () => {
    window.location.href = "/auth/login"; // Redirect to login page
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    setIsAuthenticated(false); // Update auth state
    window.location.href = "/auth/login"; 
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <div className="text-xl font-bold">Admin Dashboard</div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-200 border-r">
          <nav className="py-6 px-4">
            <ul className="space-y-4">
              <li>
                <a
                  href="/admin"
                  className="block py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="/admin/orders"
                  className="block py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Orders
                </a>
              </li>
              <li>
                <a
                  href="/admin/users"
                  className="block py-2 px-4 rounded-lg hover:bg-gray-300"
                >
                  Users
                </a>
              </li>
              <li>
                <button
                  onClick={isAuthenticated ? handleLogout : handleLogin}
                  className="block w-full text-left py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  {isAuthenticated ? "Logout" : "Login"}
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
