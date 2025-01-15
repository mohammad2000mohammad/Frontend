"use client"; 

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection

const AdminPage: FC = () => {
  const [orderCount, setOrderCount] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const [newCustomers, setNewCustomers] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem("authToken"); // Assuming token is saved in localStorage
    if (!token) {
      router.push("/auth/login"); // Redirect to login page if no token
    } else {
      fetchOrderData(token); // Proceed to fetch data if token exists
    }
  }, [router]);

  const fetchOrderData = async (token: string) => {
    try {
      const response = await fetch("https://backend-cjp5.onrender.com/api/orders/count", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data) {
        setOrderCount(data.count);
        setRevenue(data.revenue);
        setNewCustomers(data.users);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
      router.push("/auth/login"); // Redirect to login if there's an error
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Dashboard Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-4xl font-semibold text-gray-800">Admin Dashboard</h1>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Create New Report
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 - Order Count */}
        <div className="bg-white p-6 rounded-lg shadow-xl flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-600">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-800">{orderCount}</p>
          </div>
          <div className="bg-green-500 p-4 rounded-full text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h4v4H3z"
              />
            </svg>
          </div>
        </div>

        {/* Card 2 - Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-xl flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-600">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-800">${revenue}</p>
          </div>
          <div className="bg-blue-500 p-4 rounded-full text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12l5-5 5 5-5 5-5-5z"
              />
            </svg>
          </div>
        </div>

        {/* Card 3 - New Customers */}
        <div className="bg-white p-6 rounded-lg shadow-xl flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-600">New Customers</h3>
            <p className="text-3xl font-bold text-gray-800">{newCustomers}</p>
          </div>
          <div className="bg-yellow-500 p-4 rounded-full text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h5v5H5z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activities</h2>
        <ul>
          <li className="flex justify-between items-center py-3 border-b">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-500 w-8 h-8 rounded-full text-white flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12l5-5 5 5-5 5-5-5z"
                  />
                </svg>
              </div>
              <span className="text-gray-600">Order #12345 shipped</span>
            </div>
            <span className="text-sm text-gray-400">2 hours ago</span>
          </li>
          <li className="flex justify-between items-center py-3 border-b">
            <div className="flex items-center space-x-2">
              <div className="bg-green-500 w-8 h-8 rounded-full text-white flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12l5-5 5 5-5 5-5-5z"
                  />
                </svg>
              </div>
              <span className="text-gray-600">New customer registered</span>
            </div>
            <span className="text-sm text-gray-400">1 day ago</span>
          </li>
        </ul>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Order ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Customer</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Total</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 text-sm text-gray-600">#12345</td>
              <td className="px-4 py-2 text-sm text-gray-600">John Doe</td>
              <td className="px-4 py-2 text-sm text-gray-600">$250</td>
              <td className="px-4 py-2 text-sm text-gray-600">Shipped</td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-sm text-gray-600">#12346</td>
              <td className="px-4 py-2 text-sm text-gray-600">Jane Smith</td>
              <td className="px-4 py-2 text-sm text-gray-600">$320</td>
              <td className="px-4 py-2 text-sm text-gray-600">Pending</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
