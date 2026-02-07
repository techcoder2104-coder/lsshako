import { Truck, RotateCcw, Lock, Headphones } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'On orders above ₹499',
      color: 'from-primary to-sky-500'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: 'Within 30 days',
      color: 'from-secondary to-green-500'
    },
    {
      icon: Lock,
      title: 'Secure Payment',
      description: 'Your data is safe',
      color: 'from-primary to-sky-500'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Always here to help',
      color: 'from-secondary to-green-500'
    }
  ]

  return (
    <section className="bg-white py-16 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div key={idx} className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-2">
                <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300`}>
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
