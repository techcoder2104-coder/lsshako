import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Hero() {
  const [mainBanner, setMainBanner] = useState(null)
  const [categoryBanners, setCategoryBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [mainBannerAspect, setMainBannerAspect] = useState(16/9)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Fetch main banner
        const mainRes = await api.get('/banners?type=main')
        if (mainRes.data && mainRes.data.length > 0) {
          console.log('✅ Main banner loaded:', mainRes.data[0])
          setMainBanner(mainRes.data[0])
        } else {
          console.log('⚠️ No main banner found')
        }

        // Fetch category banners
        const categoryRes = await api.get('/banners?type=category')
        if (categoryRes.data && categoryRes.data.length > 0) {
          console.log('✅ Category banners loaded:', categoryRes.data.length, 'banners')
          console.log('First banner:', categoryRes.data[0])
          setCategoryBanners(categoryRes.data)
        } else {
          console.log('⚠️ No category banners found')
        }
      } catch (error) {
        console.error('❌ Error fetching banners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  const handleImageLoad = (e) => {
    const img = e.target
    const aspectRatio = img.naturalWidth / img.naturalHeight
    setMainBannerAspect(aspectRatio)
  }

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">Loading banners...</div>
  }

  // If no banners found, show helpful message
  if (!mainBanner && categoryBanners.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p className="text-yellow-800">No banners uploaded yet. Visit admin panel to add banners.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Main Hero Banner - Image Only */}
      {mainBanner ? (
        <div className="rounded-3xl overflow-hidden shadow-xl relative bg-gray-200" style={{ aspectRatio: mainBannerAspect }}>
          <img 
            src={mainBanner.image}
            alt={mainBanner.title}
            className="w-full h-full object-cover"
            onLoad={handleImageLoad}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"%3E%3Crect fill="%23e5e7eb" width="1200" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="24" font-family="sans-serif"%3EImage not available%3C/text%3E%3C/svg%3E'
            }}
          />
        </div>
      ) : null}

      {/* Category Banners Grid - Images Only */}
      {categoryBanners.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categoryBanners.map((banner) => (
            <div
              key={banner._id}
              className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 relative min-h-48 bg-gray-200"
            >
              <img 
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="300"%3E%3Crect fill="%23e5e7eb" width="600" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="16" font-family="sans-serif"%3EImage not available%3C/text%3E%3C/svg%3E'
                }}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
