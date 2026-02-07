import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import api from '../api/axios'
import { Filter, X, Search } from 'lucide-react'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  
  const searchQuery = searchParams.get('q') || ''
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sortBy, setSortBy] = useState('trending')

  // Fetch products matching search query
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        if (!searchQuery.trim()) {
          setProducts([])
          setFilteredProducts([])
          return
        }
        
        const { data } = await api.get('/products', {
          params: { search: searchQuery }
        })
        const allProducts = Array.isArray(data) ? data : []
        setProducts(allProducts)
        setFilteredProducts(allProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
        setFilteredProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchQuery])

  // Apply filters
  useEffect(() => {
    let filtered = [...products]

    // Filter by price
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    setFilteredProducts(filtered)
  }, [priceRange, sortBy, products])

  const resetFilters = () => {
    setPriceRange([0, 100000])
    setSortBy('trending')
    setMobileFiltersOpen(false)
  }

  if (!searchQuery.trim()) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No search query</h2>
          <p className="text-gray-600">Use the search bar to find products</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Search Results for "{searchQuery}"
            </h1>
            <span className="text-sm text-gray-600">{filteredProducts.length} products found</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading products...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Filters */}
            <div className={`lg:col-span-1 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-32">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Filter size={20} />
                    Filters
                  </h3>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="lg:hidden text-gray-500"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Price Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h4 className="font-semibold mb-3 text-gray-800 text-sm">Price Range</h4>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600 mt-3 font-medium">
                    ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </p>
                </div>

                {/* Sort */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800 text-sm">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="trending">Trending</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full mt-6 text-xs text-primary hover:text-sky-700 font-medium"
                >
                  Reset filters
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden mb-4 w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 font-medium text-gray-900 hover:bg-gray-50"
              >
                <Filter size={18} />
                Filters
              </button>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product._id || product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-600 text-lg">No products found.</p>
                  <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search term.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
