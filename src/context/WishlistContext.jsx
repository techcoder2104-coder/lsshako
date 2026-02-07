import { createContext, useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext'

export const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Load wishlist from localStorage on mount and when user changes
  useEffect(() => {
    if (user) {
      loadWishlist()
    } else {
      setWishlistItems([])
    }
  }, [user])

  const loadWishlist = () => {
    try {
      const key = `wishlist_${user?.id || 'guest'}`
      const saved = localStorage.getItem(key)
      if (saved) {
        setWishlistItems(JSON.parse(saved))
      } else {
        setWishlistItems([])
      }
    } catch (err) {
      console.error('Error loading wishlist:', err)
      setWishlistItems([])
    }
  }

  const saveWishlist = (items) => {
    try {
      const key = `wishlist_${user?.id || 'guest'}`
      localStorage.setItem(key, JSON.stringify(items))
      setWishlistItems(items)
    } catch (err) {
      console.error('Error saving wishlist:', err)
    }
  }

  const toggleWishlist = (product) => {
    const isInWishlist = wishlistItems.some(item => (item._id || item.id) === (product._id || product.id))
    
    if (isInWishlist) {
      removeFromWishlist(product._id || product.id)
    } else {
      addToWishlist(product)
    }
  }

  const addToWishlist = (product) => {
    const newItems = [...wishlistItems, product]
    saveWishlist(newItems)
  }

  const removeFromWishlist = (productId) => {
    const newItems = wishlistItems.filter(item => (item._id || item.id) !== productId)
    saveWishlist(newItems)
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item._id || item.id) === productId)
  }

  const clearWishlist = () => {
    saveWishlist([])
  }

  const getWishlistCount = () => {
    return wishlistItems.length
  }

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount,
    loadWishlist
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
