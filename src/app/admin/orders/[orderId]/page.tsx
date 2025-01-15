"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const OrderDetailsAdminPage = () => {
  const { orderId } = useParams(); // Access the dynamic orderId from the URL
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newStatus, setNewStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!orderId) return;

    setIsLoading(true);
    const token = localStorage.getItem("authToken"); // Retrieve the token

    fetch(`https://backend-v6sz.onrender.com/api/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOrder(data);
        setNewStatus(data.status); // Set the initial status to the current order status
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
        setIsLoading(false);
      });
  }, [orderId]);

  const handleStatusUpdate = () => {
    const token = localStorage.getItem("authToken"); // Retrieve the token

    fetch(`https://backend-v6sz.onrender.com/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => response.json())
      .then((data) => {
        setOrder(data); // Update the order status
        alert("Order status updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        alert("Failed to update order status.");
      });
  };

  const handleDeleteOrder = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
      const token = localStorage.getItem("authToken"); // Retrieve the token

      fetch(`https://backend-v6sz.onrender.com/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
        .then(() => {
          alert("Order deleted successfully.");
          router.push("/admin/orders"); // Redirect to orders list after deletion
        })
        .catch((error) => {
          console.error("Error deleting order:", error);
          alert("Failed to delete order.");
        });
    }
  };

  if (isLoading) {
    return <p>Loading order details...</p>;
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Order Details (Admin)
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>Customer Name:</strong> {order.name}
          </p>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <p>
            <strong>Address:</strong> {order.streetAddress}
          </p>
          <p>
            <strong>Phone Number:</strong> {order.phoneNumber}
          </p>
          <p>
            <strong>Status:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded ${
                order.status === "Completed"
                  ? "bg-green-500 text-white"
                  : "bg-yellow-500 text-white"
              }`}
            >
              {order.status}
            </span>
          </p>
          <p>
            <strong>Total Price:</strong> {order.totalPrice}
          </p>
        </div>

        {/* Update Status */}
        <div className="mb-6">
          <label htmlFor="status" className="block text-lg font-medium text-gray-700">
            Update Order Status:
          </label>
          <select
            id="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-lg mr-4"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Shipped">Shipped</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            onClick={handleStatusUpdate}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Update Status
          </button>
        </div>

        {/* Delete Order */}
        <button
          onClick={handleDeleteOrder}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete Order
        </button>

        {/* Items */}
        <h2 className="text-xl font-semibold mt-6 mb-4">Items:</h2>
        <ul className="list-disc ml-6">
          {JSON.parse(order.items).map((item, index) => (
            <li key={index} className="mb-4">
              <p><strong>Name:</strong> {item.name}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
              <p><strong>Price:</strong> {item.price}</p>
              <img src={item.image} alt={item.name} className="w-32 h-32 mt-2" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetailsAdminPage;
