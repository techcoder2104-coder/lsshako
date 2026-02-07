import { CreditCard, Gift, Zap } from 'lucide-react'

export default function PromoSection() {
  const promos = [
    {
      Icon: CreditCard,
      title: 'Great EMI Deals',
      desc: '0% interest on select products',
      cta: 'Learn More →',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      ctaColor: 'text-primary hover:text-blue-600',
      iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-500'
    },
    {
      Icon: Gift,
      title: 'Gift Cards',
      desc: 'Perfect gift for your loved ones',
      cta: 'Explore Now →',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
      ctaColor: 'text-secondary hover:text-green-600',
      iconBg: 'bg-gradient-to-br from-green-400 to-emerald-500'
    },
    {
      Icon: Zap,
      title: 'Fast Delivery',
      desc: 'Same day delivery in select areas',
      cta: 'Explore Now →',
      bgColor: 'bg-gradient-to-br from-orange-50 to-pink-50',
      ctaColor: 'text-orange-500 hover:text-orange-600',
      iconBg: 'bg-gradient-to-br from-orange-400 to-pink-500'
    }
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {promos.map((promo, idx) => {
          const { Icon } = promo
          return (
            <a
              key={idx}
              href="#"
              className={`${promo.bgColor} rounded-3xl p-12 text-center group cursor-pointer hover:shadow-3xl hover:-translate-y-2 transition duration-300 border border-transparent hover:border-gray-200 min-h-80 flex flex-col items-center justify-center`}
            >
              {/* Icon Badge */}
              <div className={`${promo.iconBg} rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center group-hover:scale-125 transition duration-300 shadow-2xl`}>
                <Icon size={48} className="text-white" />
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-black text-gray-900 mb-4">{promo.title}</h3>
              
              {/* Description */}
              <p className="text-gray-700 text-base mb-8 leading-relaxed">{promo.desc}</p>
              
              {/* CTA */}
              <span className={`${promo.ctaColor} font-bold text-base inline-block transition duration-300 group-hover:translate-x-2 mt-auto`}>
                {promo.cta}
              </span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
