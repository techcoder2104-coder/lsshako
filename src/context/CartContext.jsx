import { createContext, useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext'
import api from '../api/axios'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setItems([])
      setTotal(0)
    }
  }, [user])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await api.get('/cart')
      setItems(response.data.items || [])
      setTotal(response.data.total || 0)
      setError(null)
    } catch (err) {
      console.error('Error fetching cart:', err)
      setError('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null)
      const response = await api.post('/cart/add', { productId, quantity })
      setItems(response.data.items)
      setTotal(response.data.total)
      return { success: true, message: 'Item added to cart' }
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to add item to cart'
      setError(message)
      return { success: false, message }
    }
  }

  const removeFromCart = async (productId) => {
    try {
      setError(null)
      const response = await api.post('/cart/remove', { productId })
      setItems(response.data.items)
      setTotal(response.data.total)
      return { success: true }
    } catch (err) {
      const message = 'Failed to remove item from cart'
      setError(message)
      return { success: false, message }
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      setError(null)
      if (quantity <= 0) {
        return removeFromCart(productId)
      }
      const response = await api.post('/cart/update', { productId, quantity })
      setItems(response.data.items)
      setTotal(response.data.total)
      return { success: true }
    } catch (err) {
      const message = 'Failed to update quantity'
      setError(message)
      return { success: false, message }
    }
  }

  const clearCart = async () => {
    try {
      setError(null)
      await api.post('/cart/clear')
      setItems([])
      setTotal(0)
      return { success: true }
    } catch (err) {
      const message = 'Failed to clear cart'
      setError(message)
      return { success: false, message }
    }
  }

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    items,
    total,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    fetchCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
