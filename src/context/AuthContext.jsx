import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setLoading(false)
      
      // Fetch fresh user data from backend to get latest flags
      import('../api/axios').then(({ default: api }) => {
        api.get('/auth/me')
          .then(res => {
            // Update user with fresh data from backend
            const updatedUser = { ...parsedUser, ...res.data, id: res.data._id || res.data.id }
            setUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))
          })
          .catch(err => console.error('Failed to refresh user data:', err))
      })
    } else {
      setLoading(false)
    }
  }, [])

  const login = (token, user) => {
    setToken(token)
    setUser(user)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
