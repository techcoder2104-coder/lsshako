import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Package,
  CheckCircle,
  AlertCircle,
  Edit2,
} from "lucide-react";
import api from "../api/axios";

export default function DeliveryDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [stats, setStats] = useState({ total: 0, delivered: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    orderStatus: "",
    deliveryNotes: "",
  });

  useEffect(() => {
    fetchDeliveries();
    fetchStats();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await api.get("/delivery/my-deliveries");
      setDeliveries(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      setError("Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/delivery/my-stats");
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/delivery/update-status/${selectedOrder._id}`, {
        orderStatus: updateForm.orderStatus,
        deliveryNotes: updateForm.deliveryNotes,
      });

      setShowModal(false);
      setSelectedOrder(null);
      setUpdateForm({ orderStatus: "", deliveryNotes: "" });

      await fetchDeliveries();
      await fetchStats();
    } catch (err) {
      alert("Failed to update order: " + err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      out_for_delivery: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="text-green-600" size={20} />;
      case "out_for_delivery":
        return <Package className="text-orange-600" size={20} />;
      case "cancelled":
        return <AlertCircle className="text-red-600" size={20} />;
      default:
        return <Clock className="text-gray-600" size={20} />;
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">Loading deliveries...</div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Delivery Dashboard
        </h1>
        <p className="text-gray-600">Manage your assigned deliveries</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <p className="text-gray-600 mt-2">Total Deliveries</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-3xl font-bold text-green-600">
            {stats.delivered}
          </div>
          <p className="text-gray-600 mt-2">Delivered</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-3xl font-bold text-orange-600">
            {stats.pending}
          </div>
          <p className="text-gray-600 mt-2">Pending</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-3xl font-bold text-red-600">
            {stats.failed || 0}
          </div>
          <p className="text-gray-600 mt-2">Failed</p>
          {stats.successRate && (
            <p className="text-xs text-green-600 mt-2">
              Success Rate: {stats.successRate}%
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
          {error}
        </div>
      )}

      {/* Deliveries List */}
      <div className="space-y-4">
        {deliveries.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">No deliveries assigned yet</p>
          </div>
        ) : (
          deliveries.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Order #{order._id?.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}
                >
                  {getStatusIcon(order.orderStatus)}
                  {order.orderStatus?.replace("_", " ").toUpperCase()}
                </span>
              </div>

              {/* Tracking Info Badge */}
              {order.deliveryInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-xs font-semibold text-blue-600 mb-1">
                    Tracking Status
                  </p>
                  <p className="text-sm text-blue-800">
                    {order.deliveryInfo.status?.replace("_", " ").toUpperCase()}
                  </p>
                  {order.deliveryInfo.assignedAt && (
                    <p className="text-xs text-gray-600 mt-1">
                      Assigned:{" "}
                      {new Date(order.deliveryInfo.assignedAt).toLocaleString()}
                    </p>
                  )}
                  {order.deliveryInfo.expectedDeliveryTime && (
                    <p className="text-xs text-gray-600">
                      Expected:{" "}
                      {new Date(
                        order.deliveryInfo.expectedDeliveryTime,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {/* Customer Info */}
              <div className="border-t border-gray-200 pt-4 mt-4 grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Customer
                  </p>
                  <p className="text-gray-900 font-medium">
                    {order.userId?.name}
                  </p>
                  <p className="text-sm text-gray-600">{order.userId?.email}</p>
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <Phone size={16} />
                    <span>
                      {order.shippingAddress?.phone || order.userId?.phone}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Delivery Address
                  </p>
                  <div className="flex items-start gap-2 text-gray-900 mt-1">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">
                        {order.shippingAddress?.street || "Not provided"}
                      </p>
                      <p>
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state}{" "}
                        {order.shippingAddress?.pincode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Items ({order.items?.length || 0})
                </p>
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-gray-900 font-medium">
                        ₹{(item.price * item.quantity)?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-center bg-gray-50 rounded p-3">
                <p className="font-semibold text-gray-700">Total Amount</p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{order.totalAmount?.toLocaleString()}
                </p>
              </div>

              {/* Delivery Notes */}
              {(order.deliveryNotes || order.deliveryInfo?.deliveryNotes) && (
                <div className="bg-blue-50 rounded p-3 mt-4 text-sm text-blue-800">
                  <p className="font-semibold mb-1">Delivery Notes:</p>
                  <p>
                    {order.deliveryNotes || order.deliveryInfo.deliveryNotes}
                  </p>
                </div>
              )}

              {/* Action Button */}
              {order.orderStatus !== "delivered" &&
                order.orderStatus !== "cancelled" && (
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setUpdateForm({
                        orderStatus: order.orderStatus,
                        deliveryNotes: order.deliveryNotes || "",
                      });
                      setShowModal(true);
                    }}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Edit2 size={18} />
                    Update Status
                  </button>
                )}
            </div>
          ))
        )}
      </div>

      {/* Update Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Update Delivery Status
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Order #{selectedOrder._id?.slice(-6).toUpperCase()}
            </p>
            <form onSubmit={handleUpdateOrder} className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={updateForm.orderStatus}
                  onChange={(e) =>
                    setUpdateForm({
                      ...updateForm,
                      orderStatus: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="shipped">
                    Shipped (Picked from warehouse)
                  </option>
                  <option value="picked_up">Picked Up</option>
                  <option value="in_transit">In Transit</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed Delivery</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Delivery Notes
                </label>
                <textarea
                  value={updateForm.deliveryNotes}
                  onChange={(e) =>
                    setUpdateForm({
                      ...updateForm,
                      deliveryNotes: e.target.value,
                    })
                  }
                  placeholder="Add any delivery notes (optional)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
