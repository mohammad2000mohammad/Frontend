"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Using Next.js routing

const UserDetailsPage = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter(); // Use Next.js router for navigation
  const pathname = usePathname(); // Get current pathname

  const userId = pathname.split("/").pop(); // Get userId from URL path using pathname
  console.log(userId);
  // Function to get the token (assuming it's stored in localStorage or cookies)
  
    // Replace with your actual logic for getting the token
    const token = localStorage.getItem("authToken"); // or document.cookie
 

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
       // Get the token from localStorage or cookies
        
        // Set token in the headers
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch user details with token in header
        const userResponse = await fetch(`https://backend-cjp5.onrender.com/api/users/${userId}`, {
          method:"Get",
          headers,
        });
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();
        setUser(userData);

        // Fetch user orders and total paid with token in header
        const ordersResponse = await fetch(`https://backend-cjp5.onrender.com/api/orders/user/${userId}`, {
          method:"Get",
          headers,
        });
        if (!ordersResponse.ok) throw new Error("Failed to fetch orders data");
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders);
        setTotalPaid(ordersData.totalPaid);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(error.message); // Display error message to user
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]); // Fetch data when userId changes

  // Handle delete user action
  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setIsDeleting(true);
      try {
         // Get the token from localStorage or cookies

        // Set token in the headers
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await fetch(`https://backend-cjp5.onrender.com/api/users/${userId}`, {
          method: "DELETE",
          headers,
        });
        if (response.ok) {
          alert("User deleted successfully");
          // Redirect to the users list page after deletion
          router.push('/admin/users');
        } else {
          alert("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {isLoading ? (
        <p>Loading user data...</p> // You can replace this with a spinner or loading indicator
      ) : (
        <div>
          {/* User Details */}
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">User Details</h1>
          <div className="mb-4">
            <p className="text-lg">Name: {user?.name}</p>
            <p className="text-lg">Email: {user?.email}</p>
          </div>

          {/* Total Paid */}
          <div className="mb-4">
            <p className="text-lg font-semibold">Total Paid by User: $ {totalPaid}</p>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-8">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Order ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Total</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-600">{order._id}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{order.totalPrice}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{order.status}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      <button
                        onClick={() => router.push(`/admin/orders/${order._id}`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        View Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Delete User Button */}
          <div className="mb-4">
            <button
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailsPage;
