export default function ProductTag({ tag }) {
  if (!tag) return null;

  // Map tag slugs to colors - alternate between sky blue and grass green
  const tagColorMap = {
    'best-seller': 'bg-sky-500 text-white',
    'top-rated': 'bg-green-500 text-white',
    'new-arrival': 'bg-sky-500 text-white',
    'on-sale': 'bg-green-500 text-white',
    'limited-stock': 'bg-sky-500 text-white',
    'trending': 'bg-green-500 text-white',
  };

  // Default color classes for legacy tags
  const colorClasses = {
    'bg-orange-500': 'bg-sky-500 text-white',
    'bg-yellow-500': 'bg-green-500 text-white',
    'bg-blue-500': 'bg-sky-500 text-white',
    'bg-red-500': 'bg-green-500 text-white',
    'bg-green-500': 'bg-green-500 text-white',
    'bg-purple-500': 'bg-sky-500 text-white',
  };

  let className = tagColorMap[tag.slug] || colorClasses[tag.color] || 'bg-sky-500 text-white';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${className}`}>
      <span>{tag.icon}</span>
      <span>{tag.name}</span>
    </span>
  );
}
