import { useNavigate } from 'react-router-dom'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const navigate = useNavigate()
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = async (product) => {
    const result = await addToCart(product._id || product.id, 1)
    if (result.success) {
      removeFromWishlist(product._id || product.id)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart size={28} className="text-red-500 fill-red-500" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Wishlist</h1>
                <p className="text-sm text-gray-600">{wishlistItems.length} items</p>
              </div>
            </div>
            {wishlistItems.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear all items from wishlist?')) {
                    clearWishlist()
                  }
                }}
                className="text-red-600 hover:text-red-700 font-medium text-sm"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <Heart size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Add items to your wishlist to view them later</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Desktop View - Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map(product => (
                <div key={product._id || product.id} className="relative group">
                  <ProductCard product={product} />
                  <div className="absolute -top-3 -right-3 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-primary text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition z-10"
                      title="Add to Cart"
                    >
                      <ShoppingCart size={20} />
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product._id || product.id)}
                      className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition z-10"
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile View - List */}
            <div className="md:hidden space-y-4">
              {wishlistItems.map(product => (
                <div
                  key={product._id || product.id}
                  className="bg-white rounded-lg shadow p-4 flex gap-4"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">{product.category}</p>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                      {product.brand && (
                        <p className="text-xs text-primary font-medium">{product.brand}</p>
                      )}
                    </div>
                    <p className="font-bold text-lg text-gray-900">₹{product.price}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-primary text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-700 transition"
                    >
                      Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product._id || product.id)}
                      className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
