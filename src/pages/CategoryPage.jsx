import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getCategoryById, getCategories } from '../api/categoryService'
import api from '../api/axios'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCategoryAndProducts()
  }, [categoryId, selectedSubcategory])

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true)
      
      // Fetch category details
      console.log('Fetching category:', categoryId)
      const categoryData = await getCategoryById(categoryId)
      console.log('Category data:', categoryData)
      
      if (!categoryData) {
        setError('Category not found')
        setLoading(false)
        return
      }
      
      setCategory(categoryData)

      // Fetch products for this category
      let query = `?category=${encodeURIComponent(categoryData.name)}`
      if (selectedSubcategory) {
        query += `&subcategory=${encodeURIComponent(selectedSubcategory)}`
      }
      
      console.log('Fetching products with query:', query)
      const { data } = await api.get(`/products${query}`)
      console.log('Products:', data)
      setProducts(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      console.error('Error fetching data:', err)
      console.error('Error details:', err.response || err.message)
      setError('Failed to load category details: ' + (err.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-12">Loading category...</div>
      </main>
    )
  }

  if (!category) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700">Category not found</p>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        {category.image && (
          <div className="relative rounded-lg overflow-hidden mb-6 h-64 w-full group">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            {/* Overlay with Category Name */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex flex-col items-center justify-center p-6">
              <h1 className="text-5xl font-bold font-fantasy text-white drop-shadow-lg text-center">
                {category.name}
              </h1>
              <p className="text-gray-100 text-sm text-center mt-2">{category.description}</p>
            </div>
          </div>
        )}
        {!category.image && (
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{category.icon}</span>
            <div>
              <h1 className="text-4xl font-bold font-fantasy text-gray-900">{category.name}</h1>
              <p className="text-gray-600 mt-1">{category.description}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar - Subcategories */}
        {category.subcategories && category.subcategories.length > 0 && (
          <aside className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Subcategories</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setSelectedSubcategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    selectedSubcategory === null
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All Products
                </button>
                {category.subcategories.map(sub => (
                  <button
                    key={sub._id}
                    onClick={() => setSelectedSubcategory(sub.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedSubcategory === sub.name
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content - Products */}
        <div className={category.subcategories?.length > 0 ? 'md:col-span-3' : 'md:col-span-4'}>
          {/* Filters and Sort */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedSubcategory ? `${selectedSubcategory} Products` : 'All Products'}
            </h2>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Best Rated</option>
            </select>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <p className="text-gray-600 text-lg">No products found in this category</p>
              <p className="text-gray-500 mt-2">Check back soon for new products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <a
                  key={product._id}
                  href={`/product/${product._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Product Image */}
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-48 flex items-center justify-center overflow-hidden">
                    {product.image && product.image.startsWith('/uploads') ? (
                      <img
                        src={`http://localhost:5000${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2220%22 fill=%22%239ca3af%22%3EProduct Image%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    ) : (
                      <div className="text-6xl">📦</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">({product.reviews})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                      {product.originalPrice && (
                        <>
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </span>
                        </>
                      )}
                    </div>

                    {/* Stock Status */}
                    <p className={`text-sm font-medium ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.stock > 0 ? `✓ In Stock (${product.stock})` : 'Out of Stock'}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
