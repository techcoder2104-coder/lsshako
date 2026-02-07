import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function BannerCarousel() {
  const [currentBanner, setCurrentBanner] = useState(0)

  const banners = [
    {
      id: 1,
      title: '🎉 New Arrivals',
      subtitle: 'Latest products just in',
      cta: 'Shop Now',
      gradient: 'from-pink-400 to-rose-500'
    },
    {
      id: 2,
      title: '💝 Gift Cards',
      subtitle: 'Perfect gift for loved ones',
      cta: 'Buy Now',
      gradient: 'from-purple-400 to-indigo-500'
    },
    {
      id: 3,
      title: '⚡ Lightning Deals',
      subtitle: 'Limited time, limited stock',
      cta: 'Grab Now',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      id: 4,
      title: '🎁 Free Shipping',
      subtitle: 'On orders above ₹499',
      cta: 'Shop Now',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      id: 5,
      title: '💳 Zero Interest EMI',
      subtitle: 'Buy now, pay later',
      cta: 'Learn More',
      gradient: 'from-cyan-400 to-blue-500'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative">
        {/* Main Banner */}
        <div className="overflow-hidden rounded-2xl">
          <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
            {banners.map((banner) => (
              <div key={banner.id} className="w-full flex-shrink-0">
                <div className={`bg-gradient-to-r ${banner.gradient} rounded-2xl p-8 text-white text-center min-h-32 flex flex-col items-center justify-center shadow-lg`}>
                  <h3 className="text-2xl md:text-3xl font-black mb-2">{banner.title}</h3>
                  <p className="text-sm md:text-base text-white text-opacity-90 mb-4">{banner.subtitle}</p>
                  <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold hover:scale-105 transition duration-300">
                    {banner.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition duration-300 shadow-lg z-10"
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition duration-300 shadow-lg z-10"
        >
          <ChevronRight size={24} className="text-gray-900" />
        </button>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`h-2 rounded-full transition duration-300 ${
                idx === currentBanner ? 'bg-primary w-8' : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
