import api from './axios'

const API_URL = 'http://localhost:5000'

// Get all products
export const getProducts = async (params = {}) => {
  try {
    const { data } = await api.get('/products', { params })
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

// Get single product by ID with image
export const getProductById = async (id) => {
  try {
    const url = `/products/${id}`
    console.log('Fetching from URL:', url)
    console.log('Full URL will be:', api.defaults.baseURL + url)
    
    const { data } = await api.get(url)
    
    console.log('Response data:', data)
    
    // Ensure image URL is absolute
    if (data.image && !data.image.startsWith('http')) {
      data.imageUrl = API_URL + data.image
    } else {
      data.imageUrl = data.image
    }
    return data
  } catch (error) {
    console.error('Error fetching product by ID:', id, error)
    console.error('Error status:', error.response?.status)
    console.error('Error message:', error.response?.data?.error || error.message)
    throw error
  }
}

// Get product image URL by ID
export const getProductImageUrl = (product) => {
  if (!product || !product.image) {
    return null
  }
  
  // If already a full URL, return as-is
  if (product.image.startsWith('http')) {
    return product.image
  }
  
  // If local upload path, prepend API URL
  if (product.image.startsWith('/uploads')) {
    return API_URL + product.image
  }
  
  return product.image
}

// Format product with image URL
export const formatProductWithImage = (product) => {
  return {
    ...product,
    imageUrl: getProductImageUrl(product)
  }
}

export default {
  getProducts,
  getProductById,
  getProductImageUrl,
  formatProductWithImage
}
