import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { AuthContext } from '../../context/AuthContext'
import './OnboardingStyles.css'

export default function AddressForm() {
  const navigate = useNavigate()
  const { user, login } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    pincode: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user?.emailVerified) {
    navigate('/onboarding/email')
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.street.trim()) {
      setError('Street address is required')
      return false
    }
    if (!formData.city.trim()) {
      setError('City is required')
      return false
    }
    if (!formData.state.trim()) {
      setError('State is required')
      return false
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      setError('Pincode must be 6 digits')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)

    try {
      const response = await api.post('/onboarding/add-address', formData)
      const updatedUser = { ...user, ...response.data.user, id: response.data.user._id }
      login(localStorage.getItem('token'), updatedUser)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add address')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h2>Add Your Address</h2>
        <p className="onboarding-subtitle">
          This will be your default delivery address
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Street Address *</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Enter street address"
              disabled={loading}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                pincode: e.target.value.replace(/\D/g, '').slice(0, 6)
              }))}
              placeholder="6 digit pincode"
              maxLength="6"
              disabled={loading}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Complete Onboarding'}
          </button>
        </form>

        <div className="onboarding-progress">
          <div className="progress-step completed">1. Phone</div>
          <div className="progress-step completed">2. Email</div>
          <div className="progress-step active">3. Address</div>
        </div>
      </div>
    </div>
  )
}
