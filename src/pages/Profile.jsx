import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axios'
import { User, Mail, Phone, MapPin, Edit2, Save, X, Truck, Shield, Calendar } from 'lucide-react'

export default function Profile() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addresses: user?.addresses || []
  })
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setNewAddress({ ...newAddress, [name]: value })
  }

  const handleAddAddress = () => {
    if (newAddress.street && newAddress.city && newAddress.state && newAddress.pincode) {
      setFormData({
        ...formData,
        addresses: [...formData.addresses, { ...newAddress, isDefault: formData.addresses.length === 0 }]
      })
      setNewAddress({ street: '', city: '', state: '', pincode: '' })
    }
  }

  const handleRemoveAddress = (index) => {
    setFormData({
      ...formData,
      addresses: formData.addresses.filter((_, i) => i !== index)
    })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError('')
      setSuccess('')
      
      const response = await api.put('/auth/update-profile', formData)
      
      setSuccess('Profile updated successfully')
      setIsEditing(false)
      
      // Update user in localStorage
      localStorage.setItem('user', JSON.stringify({
        ...user,
        ...response.data
      }))
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/')
    }
  }

  const getBadges = () => {
    const badges = []
    if (user.isAdmin) badges.push({ icon: Shield, label: 'Admin', color: 'bg-red-100 text-red-800' })
    if (user.isDeliveryPerson) badges.push({ icon: Truck, label: 'Delivery Partner', color: 'bg-orange-100 text-orange-800' })
    return badges
  }

  const badges = getBadges()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={48} className="text-white" />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <p className="text-gray-600 mb-4">{user.email}</p>
                
                {/* Badges */}
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {badges.map((badge) => {
                      const Icon = badge.icon
                      return (
                        <span key={badge.label} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
                          <Icon size={16} />
                          {badge.label}
                        </span>
                      )
                    })}
                  </div>
                )}

                {user.createdAt && (
                  <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                    <Calendar size={16} />
                    Joined {new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
                  >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setFormData({
                        name: user?.name || '',
                        email: user?.email || '',
                        phone: user?.phone || '',
                        addresses: user?.addresses || []
                      })
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail size={20} className="text-primary" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone size={20} className="text-primary" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold text-gray-900">{user.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Saved Addresses</h2>
              
              {formData.addresses.length === 0 ? (
                <p className="text-gray-600 mb-4">No addresses saved yet</p>
              ) : (
                <div className="space-y-3 mb-4">
                  {formData.addresses.map((address, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{address.street}</p>
                        <p className="text-sm text-gray-600">{address.city}, {address.state} {address.pincode}</p>
                        {address.isDefault && (
                          <span className="inline-block mt-2 px-2 py-1 bg-primary text-white text-xs font-semibold rounded">
                            Default
                          </span>
                        )}
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveAddress(index)}
                          className="text-red-600 hover:text-red-700 transition"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {isEditing && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Add New Address</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="street"
                      placeholder="Street Address"
                      value={newAddress.street}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={handleAddressChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={handleAddAddress}
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Add Address
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-4">
            {/* Quick Links */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                >
                  📦 My Orders
                </button>
                <button
                  onClick={() => navigate('/wishlist')}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                >
                  ❤️ Wishlist
                </button>
                {user.isDeliveryPerson && (
                  <button
                    onClick={() => navigate('/delivery')}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                  >
                    🚚 Delivery Dashboard
                  </button>
                )}
                {!user.isDeliveryPerson && (
                  <button
                    onClick={() => navigate('/become-delivery')}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
                  >
                    💼 Become a Delivery Partner
                  </button>
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Account</h3>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
