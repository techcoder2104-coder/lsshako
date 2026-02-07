import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { AuthContext } from '../../context/AuthContext'
import './OnboardingStyles.css'

export default function PhoneVerification() {
  const navigate = useNavigate()
  const { user, login } = useContext(AuthContext)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    // Auto-decrement timer
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000)
      return () => clearTimeout(interval)
    }
  }, [timer])

  if (!user?.phone) {
    return <div className="onboarding-container">Error: Phone not found</div>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError('OTP must be 6 digits')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await api.post('/onboarding/verify-phone', { otp })
      const updatedUser = { ...user, ...response.data.user, id: response.data.user._id }
      login(localStorage.getItem('token'), updatedUser)
      navigate('/onboarding/email')
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError('')
    try {
      await api.post('/onboarding/resend-otp', { type: 'phone' })
      setTimer(60)
      setOtp('')
    } catch (err) {
      setError('Failed to resend OTP')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h2>Verify Your Phone</h2>
        <p className="onboarding-subtitle">
          We sent a 6-digit OTP to {user.phone}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength="6"
              placeholder="000000"
              className="otp-input"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || otp.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="resend-section">
          {timer > 0 ? (
            <p className="resend-timer">Resend OTP in {timer}s</p>
          ) : (
            <button
              className="btn-link"
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? 'Sending...' : "Didn't receive OTP? Resend"}
            </button>
          )}
        </div>

        <div className="onboarding-progress">
          <div className="progress-step active">1. Phone</div>
          <div className="progress-step">2. Email</div>
          <div className="progress-step">3. Address</div>
        </div>
      </div>
    </div>
  )
}
