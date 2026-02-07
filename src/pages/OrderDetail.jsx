import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { 
  ChevronLeft, Calendar, Clock, MapPin, DollarSign, Package, 
  CheckCircle, AlertCircle, Truck, Phone, MapPinIcon, Zap 
} from 'lucide-react'

export default function OrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [delivery, setDelivery] = useState(null)

  useEffect(() => {
    fetchOrderDetail()
  }, [orderId])

  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/orders/${orderId}`)
      setOrder(response.data)
      if (response.data.delivery) {
        setDelivery(response.data.delivery)
      }
    } catch (err) {
      setError('Failed to load order details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      out_for_delivery: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={24} />
      case 'out_for_delivery':
        return <Truck size={24} />
      case 'cancelled':
        return <AlertCircle size={24} />
      case 'confirmed':
      case 'shipped':
        return <Package size={24} />
      default:
        return <Clock size={24} />
    }
  }

  const statusSteps = [
    { status: 'pending', label: 'Order Placed', icon: Package },
    { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'out_for_delivery', label: 'Out for Delivery', icon: Zap },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle }
  ]

  const getCompletedSteps = () => {
    const statusOrder = ['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered']
    return statusOrder.indexOf(order?.orderStatus || 'pending') + 1
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/orders')}
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/orders')}
          className="mb-8 flex items-center gap-2 text-primary hover:text-blue-700 font-semibold transition"
        >
          <ChevronLeft size={20} />
          Back to Orders
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600">Placed on {formatDate(order.createdAt)} at {formatTime(order.createdAt)}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-semibold inline-flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
              {getStatusIcon(order.orderStatus)}
              <span>{order.orderStatus.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Delivery Status */}
        {delivery && order.orderStatus !== 'cancelled' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Delivery Information</h2>
            
            <div className="space-y-4">
              {/* Delivery Person */}
              {delivery.deliveryPersonId ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-semibold mb-2">Assigned Delivery Partner</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{delivery.deliveryPersonId.name}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Phone size={14} />
                        {delivery.deliveryPersonId.deliveryPhone}
                      </p>
                      <p className="text-xs text-gray-500 capitalize mt-1">
                        Vehicle: {delivery.deliveryPersonId.vehicleType}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      delivery.deliveryPersonId.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {delivery.deliveryPersonId.status}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-700 font-semibold">
                    ⏳ Assigning your delivery partner...
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">Your order will be assigned to a delivery partner soon</p>
                </div>
              )}

              {/* Current Location */}
              {delivery.currentLocation && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPinIcon size={16} />
                    Current Location
                  </p>
                  <p className="text-sm text-gray-600">
                    {delivery.currentLocation.coordinates 
                      ? `Lat: ${delivery.currentLocation.coordinates[1]}, Long: ${delivery.currentLocation.coordinates[0]}`
                      : 'Location tracking in progress'
                    }
                  </p>
                </div>
              )}

              {/* Delivery Status Details */}
              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Status</span>
                  <span className="font-semibold text-gray-900 capitalize">{delivery.status.replace('_', ' ')}</span>
                </div>
                
                {delivery.assignedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Assigned on</span>
                    <span className="text-gray-900">{formatDate(delivery.assignedAt)} {formatTime(delivery.assignedAt)}</span>
                  </div>
                )}

                {delivery.pickedUpAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Picked up on</span>
                    <span className="text-gray-900">{formatDate(delivery.pickedUpAt)} {formatTime(delivery.pickedUpAt)}</span>
                  </div>
                )}

                {delivery.outForDeliveryAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Out for delivery on</span>
                    <span className="text-gray-900">{formatDate(delivery.outForDeliveryAt)} {formatTime(delivery.outForDeliveryAt)}</span>
                  </div>
                )}

                {delivery.deliveredAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivered on</span>
                    <span className="text-green-600 font-semibold">{formatDate(delivery.deliveredAt)} {formatTime(delivery.deliveredAt)}</span>
                  </div>
                )}

                {delivery.deliveryNotes && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Delivery Notes</p>
                    <p className="text-sm text-gray-900">{delivery.deliveryNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Status Timeline */}
        {order.orderStatus !== 'cancelled' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Delivery Status</h2>
            <div className="relative">
              {/* Progress Bar Background */}
              <div className="absolute left-4 top-10 bottom-0 w-1 bg-gray-200"></div>

              {/* Progress Bar Filled */}
              <div
                className="absolute left-4 top-10 bottom-0 w-1 bg-green-500 transition-all duration-500"
                style={{ height: `${(getCompletedSteps() / statusSteps.length) * 100}%` }}
              ></div>

              {/* Steps */}
              <div className="space-y-6">
                {statusSteps.map((step, idx) => {
                  const isCompleted = getCompletedSteps() > idx
                  const isCurrent = order.orderStatus === step.status
                  const Icon = step.icon

                  return (
                    <div key={step.status} className="flex gap-6">
                      <div className="relative z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isCurrent
                              ? 'bg-blue-500 text-white animate-pulse'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                      </div>
                      <div className="flex-1 pb-6">
                        <p className={`font-semibold ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.label}
                        </p>
                        {isCurrent && <p className="text-sm text-blue-600 mt-1">Current status</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{item.price?.toLocaleString()}</p>
                      <p className="text-sm text-gray-600 mt-1">Subtotal: ₹{(item.price * item.quantity)?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Delivery Address
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">{order.shippingAddress?.street}</p>
                <p className="text-gray-600 mt-1">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
                </p>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <Phone size={16} />
                  {order.shippingAddress?.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{order.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-secondary">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Discount</span>
                  <span className="font-semibold text-green-600">- ₹0</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-gray-900">₹{order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-900 capitalize">{order.paymentMethod?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className={`font-semibold capitalize ${
                    order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Estimated Delivery */}
            {order.estimatedDelivery && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-sm text-blue-600 mb-2">Estimated Delivery</p>
                <p className="text-2xl font-bold text-blue-900 mb-2">
                  {formatDate(order.estimatedDelivery)}
                </p>
                <p className="text-sm text-blue-700">
                  Delivery within {formatTime(order.estimatedDelivery)}
                </p>
              </div>
            )}

            {/* Actions */}
            {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel this order?')) {
                    api.post(`/orders/${order._id}/cancel`)
                      .then(() => {
                        alert('Order cancelled successfully')
                        fetchOrderDetail()
                      })
                      .catch(err => alert('Failed to cancel order'))
                  }
                }}
                className="w-full border border-red-300 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-50 transition"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
