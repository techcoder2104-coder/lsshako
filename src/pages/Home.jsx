import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import api from '../api/axios'
import { getCategories } from '../api/categoryService'
import { Zap, Eye, TrendingUp, Star, Clock, AlertCircle, Gift, Facebook, Instagram, Youtube } from 'lucide-react'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [productsByTag, setProductsByTag] = useState({})
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch categories
        const categoryData = await getCategories()
        setCategories(categoryData)
        
        // Fetch all products
        const productsResponse = await api.get('/products')
        const products = productsResponse.data
        setAllProducts(products)
        
        // Fetch all tags
        const tagsResponse = await api.get('/tags')
        const allTags = tagsResponse.data
        setTags(allTags)
        
        // Organize products by tag
        const tagMap = {}
        allTags.forEach(tag => {
          tagMap[tag.slug] = products.filter(p => 
            p.tags && p.tags.some(t => (t._id || t.id) === tag._id)
          ).slice(0, 4) // Limit to 4 per section
        })
        
        setProductsByTag(tagMap)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="pt-0 bg-white min-h-screen">
      <Hero />

      {/* Categories Section */}
      <section className="bg-white w-full px-3 sm:px-4 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">Shop by Category</h2>
          {loading ? (
            <div className="text-center py-12">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No categories available</div>
          ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {categories.map((cat) => (
            <a
               key={cat._id}
               href={`/category/${cat.slug}`}
               className="group block"
             >
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg sm:rounded-xl h-24 sm:h-32 group-hover:shadow-lg transition duration-300 overflow-hidden relative">
                {/* Background Image */}
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                )}
                {!cat.image && (
                  <div className="w-full h-full flex items-center justify-center text-2xl sm:text-4xl">
                    {cat.icon || '📦'}
                  </div>
                )}
              </div>
              
              {/* Content Below */}
              <div className="mt-2 sm:mt-3 text-center">
                <p className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2">
                  {cat.name}
                </p>
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{cat.subcategories.length} categories</p>
                )}
              </div>
            </a>
            ))}
            </div>
            )}
            </div>
            </section>

      {/* Dynamic Tag-based Sections */}
      {tags.map(tag => {
        const tagProducts = productsByTag[tag.slug] || []
        
        if (tagProducts.length === 0) return null
        
        // Get icon for each tag
        const tagIcons = {
          'best-seller': '🔥',
          'top-rated': '⭐',
          'new-arrival': '✨',
          'on-sale': '💰',
          'limited-stock': '⚠️',
          'trending': '📈'
        }
        
        // Color mapping - alternate between sky blue and grass green
        const colorMap = {
          'best-seller': 'bg-sky-500',
          'top-rated': 'bg-green-500',
          'new-arrival': 'bg-sky-500',
          'on-sale': 'bg-green-500',
          'limited-stock': 'bg-sky-500',
          'trending': 'bg-green-500'
        }
        
        const iconEmoji = tagIcons[tag.slug] || tag.icon
        const tagColor = colorMap[tag.slug] || 'bg-sky-500'
        
        return (
          <section key={tag._id} className="w-full px-3 sm:px-4 py-6 sm:py-8 mb-3 sm:mb-4">
            <div className="max-w-7xl mx-auto bg-white border-2 border-green-500 rounded-lg p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10">
              <h2 className="section-title text-gray-900 text-lg sm:text-2xl">{tag.name}</h2>
              <a href={`/products?tag=${tag.slug}`} className="text-primary font-bold hover:text-sky-600 transition duration-300 text-sm sm:text-lg whitespace-nowrap">
                View All →
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {tagProducts.map(product => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
            </div>
            </section>
        )
      })}

      {/* CTA Section */}
      <section className="bg-white w-full px-3 sm:px-4 py-12 sm:py-16 mt-12 sm:mt-16 mb-12 sm:mb-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Explore All Products</h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">Browse our complete collection and find exactly what you're looking for</p>
          <a 
            href="/products" 
            className="inline-block bg-gradient-to-r from-sky-500 to-green-500 text-white px-6 sm:px-10 py-2 sm:py-3 rounded-full font-bold hover:shadow-lg transition duration-300 text-sm sm:text-base md:text-lg"
          >
            Shop Now →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-300 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          {/* Top Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-12 mb-12 md:mb-16">
            {/* Brand */}
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <svg width="180" height="50" viewBox="0 0 180 50" className="h-12 w-auto">
                    <text x="0" y="38" fontSize="32" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="2">
                      <tspan fill="#0EA5E9">t</tspan>
                      <tspan fill="#22C55E">r</tspan>
                      <tspan fill="#0EA5E9">a</tspan>
                      <tspan fill="#22C55E">d</tspan>
                      <tspan fill="#0EA5E9">o</tspan>
                      <tspan fill="#22C55E">n</tspan>
                    </text>
                  </svg>
                </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">Your one-stop shop for everything. Quality products at unbeatable prices with fastest delivery.</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold">📧</span>
                  <a href="mailto:support@tradon.com" className="text-sm hover:text-primary transition">support@tradon.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-secondary font-bold">📱</span>
                  <a href="tel:1800-TRADON" className="text-sm hover:text-primary transition">1800-TRADON-1</a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest relative pb-3">
                Quick Links
                <span className="absolute bottom-0 left-0 w-8 h-1 bg-primary"></span>
              </h3>
              <ul className="text-sm space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>Track Order</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>Become a Seller</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>Careers</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest relative pb-3">
                Categories
                <span className="absolute bottom-0 left-0 w-8 h-1 bg-secondary"></span>
              </h3>
              <ul className="text-sm space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>Electronics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>Fashion</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>Books</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>Sports</a></li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest relative pb-3">
                Policies
                <span className="absolute bottom-0 left-0 w-8 h-1 bg-primary"></span>
              </h3>
              <ul className="text-sm space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>Terms & Conditions</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>Return Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>Shipping Info</a></li>
                <li><a href="#" className="text-gray-400 hover:text-primary transition duration-300 flex items-center gap-2"><span>→</span>FAQs</a></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="text-white font-bold mb-6 uppercase text-sm tracking-widest relative pb-3">
                Connect
                <span className="absolute bottom-0 left-0 w-8 h-1 bg-secondary"></span>
              </h3>
              <div className="flex gap-6 mb-8">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition duration-300 text-gray-400 hover:text-white">
                  <Facebook size={28} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition duration-300 text-gray-400 hover:text-white">
                  <span className="font-bold text-2xl">𝕏</span>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition duration-300 text-gray-400 hover:text-white">
                  <Instagram size={28} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition duration-300 text-gray-400 hover:text-white">
                  <Youtube size={28} />
                </a>
              </div>
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-3 font-medium">Download our app</p>
                <div className="w-24 h-24 bg-white rounded-lg p-1 flex items-center justify-center">
                  <img 
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='white'/%3E%3Crect x='10' y='10' width='30' height='30' fill='black'/%3E%3Crect x='12' y='12' width='26' height='26' fill='white'/%3E%3Crect x='15' y='15' width='20' height='20' fill='black'/%3E%3Crect x='60' y='10' width='30' height='30' fill='black'/%3E%3Crect x='62' y='12' width='26' height='26' fill='white'/%3E%3Crect x='65' y='15' width='20' height='20' fill='black'/%3E%3Crect x='10' y='60' width='30' height='30' fill='black'/%3E%3Crect x='12' y='62' width='26' height='26' fill='white'/%3E%3Crect x='15' y='65' width='20' height='20' fill='black'/%3E%3Crect x='50' y='45' width='5' height='5' fill='black'/%3E%3Crect x='60' y='45' width='5' height='5' fill='black'/%3E%3Crect x='50' y='55' width='5' height='5' fill='black'/%3E%3Crect x='65' y='55' width='5' height='5' fill='black'/%3E%3C/svg%3E" 
                    alt="QR Code"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section - Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6 my-12 sm:my-16 py-8 sm:py-12 border-y border-gray-700">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black text-primary">50K+</p>
              <p className="text-xs text-gray-500 mt-2">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black text-secondary">10K+</p>
              <p className="text-xs text-gray-500 mt-2">Products</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black text-primary">24/7</p>
              <p className="text-xs text-gray-500 mt-2">Support</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black text-secondary">30 Days</p>
              <p className="text-xs text-gray-500 mt-2">Returns</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black text-primary">100%</p>
              <p className="text-xs text-gray-500 mt-2">Secure</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-black text-secondary">Free</p>
              <p className="text-xs text-gray-500 mt-2">Shipping*</p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-8 mb-6 sm:mb-8">
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-primary transition">
                <p className="text-xs sm:text-sm"><strong className="text-primary">Award Winning:</strong> Best E-commerce Platform 2024</p>
              </div>
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-secondary transition">
                <p className="text-xs sm:text-sm"><strong className="text-secondary">Trusted:</strong> Verified by 100+ Payment Partners</p>
              </div>
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3 sm:p-4 border border-gray-700 hover:border-secondary transition">
                <p className="text-xs sm:text-sm"><strong className="text-secondary">Quality:</strong> Seller & Product Verified</p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6 sm:pt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-500 space-y-3 sm:space-y-0 gap-4">
                <p className="text-center sm:text-left">&copy; 2024 Tradon Inc. All rights reserved. | Made with ❤️ for shoppers</p>
                <div className="flex gap-3 sm:gap-6 flex-wrap justify-center text-xs sm:text-sm">
                  <a href="#" className="hover:text-primary transition duration-300">Security</a>
                  <a href="#" className="hover:text-primary transition duration-300">Accessibility</a>
                  <a href="#" className="hover:text-primary transition duration-300">Cookie Settings</a>
                  <a href="#" className="hover:text-primary transition duration-300">Sitemap</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
