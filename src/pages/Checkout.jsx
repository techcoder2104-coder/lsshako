import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { AuthContext } from '../context/AuthContext'
import { ChevronRight, Plus } from 'lucide-react'

export default function Checkout() {
  const { user } = useContext(AuthContext)
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    paymentMethod: 'upi'
  })

  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  })

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart')
      setCartItems(response.data.items)
      setTotal(response.data.total)
    } catch (err) {
      setError('Failed to load cart')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddressSelect = (addressId) => {
    const address = user?.addresses?.find(a => a._id === addressId)
    if (address) {
      setSelectedAddressId(addressId)
      setFormData({
        ...formData,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        phone: user.phone
      })
      setShowAddAddress(false)
    }
  }

  const handleNewAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value
    })
  }

  const handleAddNewAddress = async (e) => {
    e.preventDefault()
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      setError('All address fields required')
      return
    }

    try {
      await api.put('/auth/update-profile', {
        addresses: [...(user?.addresses || []), newAddress]
      })
      // Reload user data
      const response = await api.get('/auth/me')
      setNewAddress({ street: '', city: '', state: '', pincode: '' })
      setShowAddAddress(false)
      setError('')
    } catch (err) {
      setError('Failed to add address')
    }
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/orders/create', {
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod
      })

      // Process payment
      await api.post(`/orders/${response.data.orderId}/pay`)

      // Redirect to orders page
      navigate('/orders')
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-secondary text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="text-primary hover:text-primary-dark flex items-center gap-1"
                  >
                    <Plus size={18} /> Add New
                  </button>
                </div>

                {/* Saved Addresses */}
                {user?.addresses && user.addresses.length > 0 && (
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm font-medium text-gray-700 mb-3">Your Addresses</p>
                    <div className="space-y-2">
                      {user.addresses.map((address, idx) => (
                        <label key={idx} className="flex items-start p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === address._id}
                            onChange={() => handleAddressSelect(address._id)}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{address.street}</p>
                            <p className="text-sm text-gray-600">{address.city}, {address.state} {address.pincode}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add New Address Form */}
                {showAddAddress && (
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-gray-900 mb-3">Add New Address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <input
                          type="text"
                          name="street"
                          value={newAddress.street}
                          onChange={handleNewAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          placeholder="Enter street address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          value={newAddress.city}
                          onChange={handleNewAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={newAddress.state}
                          onChange={handleNewAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={newAddress.pincode}
                          onChange={handleNewAddressChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                          placeholder="Pincode"
                          maxLength="6"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddNewAddress}
                        className="col-span-2 bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                )}

                {/* Use Selected Address or Manual Entry */}
                {!showAddAddress && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  {['upi', 'credit_card', 'debit_card', 'net_banking'].map((method) => (
                    <label key={method} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="ml-3 text-gray-700 capitalize">{method.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white py-3 rounded-lg font-bold hover:bg-green-600 transition disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Pay ₹${total}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-20">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-secondary">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <span className="text-green-600 font-semibold">✓</span>
                <span className="text-sm text-green-700">Delivery in 18 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
