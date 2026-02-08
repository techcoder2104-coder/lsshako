import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getCategoryById } from '../api/categoryService'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

export default function CategoryPage() {
  const { categoryId } = useParams()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCategoryAndProducts()
  }, [categoryId])

  const fetchCategoryAndProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch category
      const categoryData = await getCategoryById(categoryId)
      if (!categoryData) {
        setError('Category not found')
        setLoading(false)
        return
      }
      
      setCategory(categoryData)

      // Fetch products for this category
      const { data } = await api.get(`/products?category=${encodeURIComponent(categoryData.name)}`)
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'Failed to load category')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-700">
          {error}
        </div>
      </main>
    )
  }

  if (!category) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-gray-500">Category not found</div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            No products found in this category
          </div>
        )}
      </div>
    </main>
  )
}
