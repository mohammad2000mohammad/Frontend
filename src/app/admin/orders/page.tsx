"use client"
import { useState, useEffect } from "react";
import Link from "next/link";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track the total pages
  const [searchTerm, setSearchTerm] = useState(""); // Track the search term
  const [totalOrders, setTotalOrders] = useState(0); // Track the total number of orders
  const [dateFilter, setDateFilter] = useState(""); // Track the date filter (week, month, year)
  const [statusFilter, setStatusFilter] = useState(""); // Track the status filter (Pending or Completed)

  // Fetch orders from the backend with pagination, search, date filtering, and status filtering
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");  // Get the token from localStorage
      
      if (!token) {
        console.error("No token found");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://backend-cjp5.onrender.com/api/orders/search?searchTerm=${searchTerm}&page=${page}&limit=10&dateFilter=${dateFilter}&statusFilter=${statusFilter}`, {
            method: "GET", // Explicitly set method
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`, // Include token in the Authorization header
            },
          }
        );
        
        const data = await response.json();
        setOrders(data.orders);
        setTotalOrders(data.totalOrders);
        setTotalPages(data.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [searchTerm, page, dateFilter, statusFilter]); // Fetch data when search term, page, date filter, or status filter changes

  // Update the order status
  const updateOrderStatus = (orderId, newStatus) => {
    const trimmedOrderId = orderId.trim();
    const token = localStorage.getItem("authToken");  // Get the token from localStorage

    if (!token) {
      console.error("No token found");
      return;
    }

    fetch(`https://backend-cjp5.onrender.com/api/orders/${trimmedOrderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Include token in the Authorization header
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === trimmedOrderId ? { ...order, status: newStatus } : order
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update order status:", error);
      });
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to the first page when search term changes
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle date filter button click
  const handleDateFilterChange = (filter) => {
    setDateFilter((prevFilter) => (prevFilter === filter ? "" : filter)); // Toggle the filter
    setPage(1); // Reset to the first page when date filter changes
  };

  // Handle status filter button click
  const handleStatusFilterChange = (status) => {
    setStatusFilter((prevStatus) => (prevStatus === status ? "" : status)); // Toggle the filter
    setPage(1); // Reset to the first page when status filter changes
  };

  // Handle All Orders button click
  const handleAllOrdersClick = () => {
    setDateFilter(""); // Clear date filter to fetch all orders
    setStatusFilter(""); // Clear status filter to fetch all orders
    setPage(1); // Reset to the first page
  };

  // Function to determine if a button should have the active style
  const isButtonActive = (filter, value) => {
    return filter === value ? "bg-blue-600 text-white" : "bg-gray-500 text-white";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Manage Orders</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search orders by name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded-md w-full sm:w-1/3"
        />
      </div>

      {/* Date Filter Buttons */}
      <div className="mb-4">
        <button
          onClick={() => handleDateFilterChange("thisWeek")}
          className={`px-4 py-2 mr-2 rounded-md hover:bg-blue-700 ${isButtonActive(dateFilter, "thisWeek")}`}
        >
          This Week
        </button>
        <button
          onClick={() => handleDateFilterChange("thisMonth")}
          className={`px-4 py-2 mr-2 rounded-md hover:bg-blue-700 ${isButtonActive(dateFilter, "thisMonth")}`}
        >
          This Month
        </button>
        <button
          onClick={() => handleDateFilterChange("thisYear")}
          className={`px-4 py-2 mr-2 rounded-md hover:bg-blue-700 ${isButtonActive(dateFilter, "thisYear")}`}
        >
          This Year
        </button>
        <button
          onClick={handleAllOrdersClick}
          className={`px-4 py-2 mr-2 rounded-md hover:bg-gray-700 ${!dateFilter && !statusFilter ? "bg-blue-600 text-white" : "bg-gray-500 text-white"}`}
        >
          All Orders
        </button>
      </div>

      {/* Status Filter Buttons */}
      <div className="mb-4">
        <button
          onClick={() => handleStatusFilterChange("Pending")}
          className={`px-4 py-2 mr-2 rounded-md hover:bg-yellow-600 ${isButtonActive(statusFilter, "Pending")}`}
        >
          Pending
        </button>
        <button
          onClick={() => handleStatusFilterChange("Completed")}
          className={`px-4 py-2 mr-2 rounded-md hover:bg-green-600 ${isButtonActive(statusFilter, "Completed")}`}
        >
          Completed
        </button>
      </div>

      {isLoading ? (
        <p>Loading orders...</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-8">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Order ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Customer</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Total</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Payment</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{order.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      <span
                        className={`${
                          order.status === "Completed"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">${order.totalPrice}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{order.payment}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      <Link href={`/admin/orders/${order._id}`}>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                          View Details
                        </button>
                      </Link>
                      <button
                        className={`ml-2 px-4 py-2 rounded-lg hover:bg-opacity-80 
                          ${order.status === "Pending" ? "bg-yellow-500 text-white" : "bg-green-500 text-white"}`}
                        onClick={() =>
                          updateOrderStatus(
                            order._id,
                            order.status === "Pending" ? "Completed" : "Pending"
                          )
                        }
                      >
                        {order.status === "Pending" ? "Update to Completed" : "Update to Pending"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
