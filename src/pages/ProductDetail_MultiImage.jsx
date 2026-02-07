import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Heart, Share2, Truck, RotateCcw, ShoppingCart, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { getProductById, getProductImageUrl } from '../api/productService'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartMessage, setCartMessage] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        console.log('Fetching product with ID:', id)
        const data = await getProductById(id)
        console.log('Product fetched:', data)
        setProduct(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching product:', err)
        console.error('Error details:', err.response || err.message)
        setError(`Failed to load product details: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    } else {
      setError('No product ID provided')
    }
  }, [id])

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true)
      const result = await addToCart(id, quantity)
      if (result.success) {
        setCartMessage('✓ Added to cart!')
        setTimeout(() => setCartMessage(''), 3000)
        setQuantity(1)
      }
    } catch (err) {
      setCartMessage('Failed to add to cart')
      setTimeout(() => setCartMessage(''), 3000)
    } finally {
      setAddingToCart(false)
    }
  }

  const getProductImages = () => {
    if (!product) return []
    // Support both 'images' array and single 'image' field
    const images = product.images && Array.isArray(product.images) ? product.images : []
    const mainImage = product.image ? getProductImageUrl(product) : null
    return mainImage ? [mainImage, ...images] : images
  }

  const nextImage = () => {
    const images = getProductImages()
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    const images = getProductImages()
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-12">Loading product details...</div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Unable to Load Product</h2>
          <p className="text-red-700 mb-4">{error || 'Product not found'}</p>
          <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
        </div>
      </main>
    )
  }

  const inStock = product.stock > 0
  const allImages = getProductImages()
  const currentImage = allImages[selectedImageIndex]

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Product Images Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-gradient-to-br from-sky-300 to-emerald-400 rounded-lg aspect-square flex items-center justify-center overflow-hidden group">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="h-full w-full object-contain cursor-pointer"
                onClick={() => setShowImageModal(true)}
              />
            ) : (
              <div className="text-6xl">📦</div>
            )}

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition opacity-0 group-hover:opacity-100 z-10"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition opacity-0 group-hover:opacity-100 z-10"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    index === selectedImageIndex
                      ? 'border-primary shadow-lg'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-contain bg-gray-50"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="text-gray-600 text-sm">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 pb-4 sm:pb-6 border-b border-gray-200">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{product.price?.toLocaleString()}</span>
            <span className="text-lg sm:text-xl text-gray-500 line-through">₹{product.originalPrice?.toLocaleString()}</span>
            <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-lg font-semibold text-sm">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm sm:text-base">{product.description}</p>

          {/* Stock Status */}
          <div className="pb-4 sm:pb-6 border-b border-gray-200">
            <p className={`font-semibold text-sm sm:text-base ${inStock ? 'text-green-600' : 'text-red-600'}`}>
              {inStock ? `✓ In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="pb-4 sm:pb-6 border-b border-gray-200">
            <label className="block text-sm font-semibold text-gray-800 mb-3">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-lg font-semibold"
              >
                −
              </button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-lg font-semibold"
              >
                +
              </button>
            </div>
          </div>

          {/* Cart Message */}
          {cartMessage && (
            <div className={`p-3 rounded-lg text-center text-sm font-medium ${
              cartMessage.includes('✓')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {cartMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !inStock}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed py-3"
            >
              <ShoppingCart size={20} />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button className="btn-secondary py-3">Buy Now</button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="px-4 sm:px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-primary transition flex items-center justify-center"
            >
              <Heart
                size={20}
                fill={isFavorite ? '#FF6B35' : 'none'}
                stroke={isFavorite ? '#FF6B35' : 'currentColor'}
              />
            </button>
            <button className="px-4 sm:px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-primary transition flex items-center justify-center">
              <Share2 size={20} />
            </button>
          </div>

          {/* Benefits */}
          <div className="space-y-3 bg-sky-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-sky-600" />
              <div>
                <p className="font-semibold text-gray-900">Free Delivery</p>
                <p className="text-xs text-gray-600">On orders above ₹500</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw size={20} className="text-sky-600" />
              <div>
                <p className="font-semibold text-gray-900">Easy Returns</p>
                <p className="text-xs text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications and Features */}
      <div className="mt-12 sm:mt-16 grid md:grid-cols-2 gap-8">
        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
            <div className="space-y-3 bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between pb-3 border-b border-gray-100 last:border-b-0">
                  <span className="font-semibold text-gray-700 text-sm sm:text-base capitalize">{key}</span>
                  <span className="text-gray-600 text-sm sm:text-base">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {product.features && Object.keys(product.features).length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <div className="space-y-2 bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              {Object.entries(product.features).map(([key, value]) => (
                <div key={key} className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-1">✓</span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base capitalize">{key}</p>
                    <p className="text-gray-600 text-xs sm:text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition"
          >
            <X size={28} />
          </button>

          <div className="relative max-w-4xl w-full">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 transition"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 transition"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
