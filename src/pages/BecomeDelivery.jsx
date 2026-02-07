import { useState, useEffect } from 'react'
import { Truck, FileText, MapPin, Phone, Users, AlertCircle, CheckCircle } from 'lucide-react'
import api from '../api/axios'

export default function BecomeDelivery() {
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [existing, setExisting] = useState(null)
  const [error, setError] = useState(null)
  const [banners, setBanners] = useState([])
  const [deliveryZones, setDeliveryZones] = useState([])
  const [bannerAspects, setBannerAspects] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    aadharNumber: '',
    panNumber: '',
    deliveryArea: '',
    address: { street: '', city: '', state: '', pincode: '' },
    vehicleType: 'bike',
    vehicleNumber: '',
    experienceYears: 0,
    bankAccountNumber: '',
    ifscCode: '',
    selectedZones: []
  })

  useEffect(() => {
    checkExistingRequest()
    fetchBanners()
    fetchDeliveryZones()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await api.get('/banners?type=delivery')
      if (response.data) {
        setBanners(response.data)
      }
    } catch (err) {
      console.error('Error fetching banners:', err)
    }
  }

  const fetchDeliveryZones = async () => {
    try {
      const response = await api.get('/delivery-zones')
      setDeliveryZones(Array.isArray(response.data) ? response.data : [])
    } catch (err) {
      console.error('Error fetching delivery zones:', err)
    }
  }

  const handleBannerLoad = (e, bannerId) => {
    const img = e.target
    const aspectRatio = img.naturalWidth / img.naturalHeight
    setBannerAspects(prev => ({
      ...prev,
      [bannerId]: aspectRatio
    }))
  }

  const checkExistingRequest = async () => {
    try {
      const response = await api.get('/delivery-requests/my-request')
      if (response.data) {
        setExisting(response.data)
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value }
      })
    } else if (name === 'zones') {
      if (checked) {
        setFormData({
          ...formData,
          selectedZones: [...formData.selectedZones, value]
        })
      } else {
        setFormData({
          ...formData,
          selectedZones: formData.selectedZones.filter(z => z !== value)
        })
      }
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError(null)
      await api.post('/delivery-requests/submit', formData)
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request')
    }
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">Loading...</div>
      </main>
    )
  }

  // Already has a request
  if (existing) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mx-auto mb-4">
              <FileText className="text-blue-600" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Request Already Submitted</h1>
            
            <div className="mt-8 space-y-4">
              <div className={`p-4 rounded-lg ${
                existing.status === 'approved' ? 'bg-green-50 border border-green-200' :
                existing.status === 'rejected' ? 'bg-red-50 border border-red-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {existing.status === 'approved' && <CheckCircle className="text-green-600" size={24} />}
                  {existing.status === 'rejected' && <AlertCircle className="text-red-600" size={24} />}
                  {existing.status === 'pending' && <FileText className="text-blue-600" size={24} />}
                  <h3 className="font-semibold text-lg">
                    {existing.status === 'approved' && 'Request Approved!'}
                    {existing.status === 'rejected' && 'Request Rejected'}
                    {existing.status === 'pending' && 'Request Pending'}
                  </h3>
                </div>
                
                <p className={`text-sm ${
                  existing.status === 'approved' ? 'text-green-700' :
                  existing.status === 'rejected' ? 'text-red-700' :
                  'text-blue-700'
                }`}>
                  {existing.status === 'approved' && 'Congratulations! Your delivery request has been approved. You can now access the delivery dashboard.'}
                  {existing.status === 'rejected' && existing.rejectionReason && `Reason: ${existing.rejectionReason}`}
                  {existing.status === 'pending' && 'Your request is under review. Please check back later.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-gray-600">Delivery Area</p>
                  <p className="font-semibold text-gray-900">{existing.deliveryArea}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vehicle Type</p>
                  <p className="font-semibold text-gray-900 capitalize">{existing.vehicleType}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Successfully submitted
  if (submitted) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 rounded-lg border border-green-200 p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-green-900 mb-2">Request Submitted Successfully!</h1>
            <p className="text-green-700 mb-6">Your delivery request has been submitted. Our team will review it and contact you soon.</p>
            <a href="/" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              Back to Home
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Delivery Banners */}
        {banners.length > 0 && (
          <div className="space-y-4 mb-8">
            {banners.map((banner) => (
              <div 
                key={banner._id} 
                className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
                style={{ aspectRatio: bannerAspects[banner._id] || 16/9 }}
              >
                {banner.image && (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                    onLoad={(e) => handleBannerLoad(e, banner._id)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Personal Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
            </div>
          </div>

          {/* Government IDs */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Government Identification</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="aadharNumber"
                placeholder="Aadhar Number (12 digits)"
                value={formData.aadharNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                pattern="\d{12}"
                required
              />
              <input
                type="text"
                name="panNumber"
                placeholder="PAN Number (10 characters)"
                value={formData.panNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                pattern="[A-Z0-9]{10}"
                required
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="address.street"
                placeholder="Street Address"
                value={formData.address.street}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="address.city"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
                <input
                  type="text"
                  name="address.state"
                  placeholder="State"
                  value={formData.address.state}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>
              <input
                type="text"
                name="address.pincode"
                placeholder="Pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                pattern="\d{6}"
                required
              />
            </div>
          </div>

          {/* Delivery Area */}
           <div>
             <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Delivery Area</label>
             <input
               type="text"
               name="deliveryArea"
               placeholder="e.g., Central Delhi, South Delhi"
               value={formData.deliveryArea}
               onChange={handleChange}
               className="w-full border border-gray-300 rounded-lg px-4 py-2"
               required
             />
           </div>

          {/* Delivery Zones */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Delivery Zones *</label>
            {deliveryZones.length > 0 ? (
              <div className="border border-gray-300 rounded-lg p-4 space-y-3">
                {deliveryZones.map(zone => (
                  <label key={zone._id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      name="zones"
                      value={zone._id}
                      checked={formData.selectedZones.includes(zone._id)}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{zone.name}</p>
                      <p className="text-sm text-gray-600">{zone.city} • {zone.pincodes.join(', ')}</p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">No delivery zones available at the moment</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Selected: {formData.selectedZones.length} zone(s)
            </p>
          </div>

          {/* Vehicle Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Details</h2>
            <div className="space-y-4">
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                required
              >
                <option value="bike">Two Wheeler (Bike/Scooter)</option>
                <option value="auto">Auto Rickshaw</option>
                <option value="car">Four Wheeler (Car)</option>
                <option value="bicycle">Bicycle</option>
              </select>
              <input
                type="text"
                name="vehicleNumber"
                placeholder="Vehicle Registration Number"
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="number"
                name="experienceYears"
                placeholder="Years of Delivery Experience"
                value={formData.experienceYears}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                min="0"
              />
            </div>
          </div>

          {/* Bank Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bank Details (for payments)</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="bankAccountNumber"
                placeholder="Bank Account Number"
                value={formData.bankAccountNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="text"
                name="ifscCode"
                placeholder="IFSC Code"
                value={formData.ifscCode}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Submit Application
          </button>
        </form>

        {/* Terms */}
        <p className="text-center text-sm text-gray-600 mt-6">
          By submitting this form, you agree to our terms and conditions.
          Your information will be verified before approval.
        </p>
      </div>
    </main>
  )
}
