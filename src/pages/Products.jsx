import { useState, useEffect, useContext } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import api from '../api/axios'
import { Filter, X, ChevronDown, Search, Home, ShoppingCart, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { AuthContext } from '../context/AuthContext'

export default function Products() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])

  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Get cart and auth context
  const { getCartCount, total } = useCart()
  const { getWishlistCount } = useWishlist()
  const { user } = useContext(AuthContext)

  const cartItems = getCartCount()
  const wishlistItems = getWishlistCount()

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [sortBy, setSortBy] = useState('trending')

  // Fetch all products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch products
        const productsRes = await api.get('/products')
        const allProducts = Array.isArray(productsRes.data) ? productsRes.data : []
        setProducts(allProducts)

        // Fetch categories from backend to get proper subcategories
        try {
          const categoriesRes = await api.get('/categories')
          const categoryList = Array.isArray(categoriesRes.data) ? categoriesRes.data : []
          const categoryNames = categoryList.map(c => c.name)
          setCategories(categoryNames)
        } catch (err) {
          // Fallback to unique categories from products
          const uniqueCategories = [...new Set(allProducts.map(p => p.category))].filter(Boolean)
          setCategories(uniqueCategories)
        }


        setFilteredProducts(allProducts)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Update subcategories when category changes
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory !== 'all') {
        try {
          // Try to fetch from backend first
          const categoriesRes = await api.get('/categories')
          const categoryList = Array.isArray(categoriesRes.data) ? categoriesRes.data : []
          const selectedCat = categoryList.find(c => c.name === selectedCategory)
          
          if (selectedCat && selectedCat.subcategories && Array.isArray(selectedCat.subcategories)) {
            // If subcategories exist in backend, use them
            const subNames = selectedCat.subcategories.map(s => s.name || s)
            setSubcategories(subNames)
          } else {
            // Fallback: get from products
            const categoryProducts = products.filter(p => p.category === selectedCategory)
            const uniqueSubs = [...new Set(
              categoryProducts
                .map(p => p.subcategoryName)
                .filter(Boolean)
            )]
            setSubcategories(uniqueSubs)
          }
        } catch (err) {
          // Fallback: get from products
          const categoryProducts = products.filter(p => p.category === selectedCategory)
          const uniqueSubs = [...new Set(
            categoryProducts
              .map(p => p.subcategoryName)
              .filter(Boolean)
          )]
          setSubcategories(uniqueSubs)
        }
        setSelectedSubcategory('all')
      } else {
        setSubcategories([])
        setSelectedSubcategory('all')
      }
    }

    fetchSubcategories()
  }, [selectedCategory, products])

  // Apply all filters
  useEffect(() => {
    let filtered = [...products]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    // Filter by subcategory
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(
        p => p.subcategoryName === selectedSubcategory
      )
    }

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
    }, [selectedCategory, selectedSubcategory, priceRange, searchTerm, sortBy, products])



  const resetFilters = () => {
    setSelectedCategory('all')
    setSelectedSubcategory('all')
    setPriceRange([0, 100000])
    setSearchTerm('')
    setSortBy('trending')
    setMobileFiltersOpen(false)
  }

  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) + (selectedSubcategory !== 'all' ? 1 : 0)

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="text-center py-12">Loading products...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Minimal Header with Home Link and Cart */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-sky-700 transition">
            <Home size={16} />
            Back to Home
          </Link>

          {/* Right Menu - Cart, Wishlist, User */}
          <div className="flex items-center gap-3 sm:gap-4">
            {user && (
              <>
                {/* Wishlist Link */}
                <Link to="/wishlist" className="flex items-center gap-1 text-red-600 hover:text-red-700 transition relative" title="Wishlist">
                  <Heart size={18} />
                  {wishlistItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                      {wishlistItems}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Cart Button */}
            <Link to="/cart" className="flex items-center gap-2 bg-secondary hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition relative text-sm">
              <ShoppingCart size={18} />
              {cartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                  {cartItems}
                </span>
              )}
              <span className="hidden sm:inline">{cartItems} items</span>
              <span className="hidden sm:inline">₹{total}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

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

              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="w-full mb-4 text-xs text-primary hover:text-sky-700 font-medium"
                >
                  Clear all filters
                </button>
              )}

              {/* Category Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-semibold mb-3 text-gray-800 text-sm">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer hover:text-primary">
                    <input
                      type="radio"
                      checked={selectedCategory === 'all'}
                      onChange={() => setSelectedCategory('all')}
                      className="mr-2 w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">All Categories</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center cursor-pointer hover:text-primary">
                      <input
                        type="radio"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="mr-2 w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subcategory Filter */}
              {subcategories.length > 0 && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h4 className="font-semibold mb-3 text-gray-800 text-sm">Subcategory</h4>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer hover:text-primary">
                      <input
                        type="radio"
                        checked={selectedSubcategory === 'all'}
                        onChange={() => setSelectedSubcategory('all')}
                        className="mr-2 w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">All Subcategories</span>
                    </label>
                    {subcategories.map(subcat => (
                      <label key={subcat} className="flex items-center cursor-pointer hover:text-primary">
                        <input
                          type="radio"
                          checked={selectedSubcategory === subcat}
                          onChange={() => setSelectedSubcategory(subcat)}
                          className="mr-2 w-4 h-4"
                        />
                        <span className="text-sm text-gray-700 line-clamp-1">{subcat}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

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
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
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
      </div>
    </main>
  )
}
