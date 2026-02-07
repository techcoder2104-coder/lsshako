import { Shield, Zap, Award, TrendingUp } from 'lucide-react'

export default function TrustBadges() {
  return (
    <section className="bg-white py-8 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-primary bg-opacity-20 p-3 rounded-full">
              <Award className="text-primary" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Trusted by 50K+</p>
              <p className="text-xs text-gray-600">Happy Customers</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="bg-secondary bg-opacity-20 p-3 rounded-full">
              <Zap className="text-secondary" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">10K+ Products</p>
              <p className="text-xs text-gray-600">Always in Stock</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="bg-secondary bg-opacity-20 p-3 rounded-full">
              <Zap className="text-secondary" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">30-Day Returns</p>
              <p className="text-xs text-gray-600">100% Hassle Free</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="bg-primary bg-opacity-20 p-3 rounded-full">
              <Shield className="text-primary" size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Secure Payment</p>
              <p className="text-xs text-gray-600">100% Safe</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
