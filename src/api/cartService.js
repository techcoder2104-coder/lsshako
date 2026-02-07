import api from './axios'

export const getCart = async () => {
  try {
    const response = await api.get('/cart')
    return response.data
  } catch (error) {
    console.error('Error fetching cart:', error)
    throw error
  }
}

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post('/cart/add', { productId, quantity })
    return response.data
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

export const removeFromCart = async (productId) => {
  try {
    const response = await api.post('/cart/remove', { productId })
    return response.data
  } catch (error) {
    console.error('Error removing from cart:', error)
    throw error
  }
}

export const updateQuantity = async (productId, quantity) => {
  try {
    const response = await api.post('/cart/update', { productId, quantity })
    return response.data
  } catch (error) {
    console.error('Error updating quantity:', error)
    throw error
  }
}

export const clearCart = async () => {
  try {
    const response = await api.post('/cart/clear')
    return response.data
  } catch (error) {
    console.error('Error clearing cart:', error)
    throw error
  }
}

export default {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
}
