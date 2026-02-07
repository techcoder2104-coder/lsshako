import { useState, useEffect } from 'react'
import { X, Search, TrendingUp, Clock, ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SearchModal({ isOpen, onClose, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [trendingSearches, setTrendingSearches] = useState([])
  const [recommendedBrands, setRecommendedBrands] = useState([])
  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 3))
      } catch (e) {
        console.error('Error loading recent searches:', e)
      }
    }
  }, [])

  // Fetch trending data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchTrendingData()
    }
  }, [isOpen])

  const fetchTrendingData = async () => {
    setLoading(true)
    try {
      // Fetch trending searches
      const trendingRes = await fetch(`${import.meta.env.VITE_API_URL}/api/search/trending`)
      if (trendingRes.ok) {
        const trendingData = await trendingRes.json()
        setTrendingSearches(trendingData.slice(0, 6))
      }

      // Fetch recommended brands
      const brandsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/search/brands`)
      if (brandsRes.ok) {
        const brandsData = await brandsRes.json()
        setRecommendedBrands(brandsData.slice(0, 6))
      }

      // Fetch recommended products
      const productsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/products?sortBy=trending&limit=6`)
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setRecommendedProducts(productsData)
      }
    } catch (error) {
      console.error('Error fetching trending data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e, query = null) => {
    e?.preventDefault()
    const finalQuery = query || searchQuery.trim()
    
    if (finalQuery) {
      // Save to recent searches
      const saved = localStorage.getItem('recentSearches')
      let recent = saved ? JSON.parse(saved) : []
      recent = [finalQuery, ...recent.filter(s => s !== finalQuery)].slice(0, 3)
      localStorage.setItem('recentSearches', JSON.stringify(recent))

      // Track the search
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/search/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: finalQuery })
        })
      } catch (error) {
        console.error('Error tracking search:', error)
      }
      
      onSearch(finalQuery)
      navigate(`/search?q=${encodeURIComponent(finalQuery)}`)
      setSearchQuery('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-16 left-0 right-0 bg-white z-50 max-h-[80vh] overflow-y-auto shadow-lg">
        <div className="px-4 md:px-6 py-5">
          {/* Search Input with border */}
          <form onSubmit={(e) => handleSearch(e)} className="mb-6">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search on Tradon"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:border-pink-500 transition text-sm"
              />
            </div>
          </form>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-0">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 px-2 py-2">Recent</h3>
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => handleSearch(e, search)}
                      className="w-full flex items-center gap-3 px-2 py-2.5 text-gray-700 hover:bg-gray-50 transition text-sm"
                    >
                      <Clock size={16} className="text-gray-400 flex-shrink-0" />
                      <span>{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Trending Searches Section */}
              {trendingSearches.length > 0 && (
                <div>
                  <h3 className="bg-gray-700 text-white font-semibold px-2 py-2.5 text-sm sticky top-0">
                    Trending Searches
                  </h3>
                  <div className="border-t border-gray-100">
                    {trendingSearches.map((search) => (
                      <button
                        key={search._id || search}
                        onClick={(e) => handleSearch(e, typeof search === 'string' ? search : search.term)}
                        className="w-full flex items-center gap-3 px-2 py-3 text-gray-700 hover:bg-gray-50 transition text-sm border-b border-gray-100 last:border-b-0"
                      >
                        <ArrowUpRight size={16} className="text-gray-400 flex-shrink-0" />
                        <span>{typeof search === 'string' ? search : search.term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Brands */}
              {recommendedBrands.length > 0 && (
                <div className="mt-4">
                  <h3 className="bg-gray-700 text-white font-semibold px-2 py-2.5 text-sm sticky top-0">
                    Popular Brands
                  </h3>
                  <div className="border-t border-gray-100">
                    {recommendedBrands.map((brand, idx) => (
                      <button
                        key={brand._id || idx}
                        onClick={(e) => handleSearch(e, typeof brand === 'string' ? brand : brand.name)}
                        className="w-full flex items-center gap-3 px-2 py-3 text-gray-700 hover:bg-gray-50 transition text-sm border-b border-gray-100 last:border-b-0"
                      >
                        <ArrowUpRight size={16} className="text-gray-400 flex-shrink-0" />
                        <span>{typeof brand === 'string' ? brand : brand.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
