import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useCallback } from "react";
import { getProductImageUrl } from "../api/productService";
import ProductTag from "./ProductTag";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const useBlueTheme =
    (product._id || product.id || "").charCodeAt(0) % 2 === 0;
  const isWishlisted = isInWishlist(product._id || product.id);

  // Memoize the image URL to prevent unnecessary recalculations
  const imageUrl = useMemo(() => getProductImageUrl(product), [product.image]);

  const handleAddToCart = useCallback(
    (e) => {
      e.preventDefault();
      if (product.stock <= 0) {
        toast.warning("Product is out of stock");
        return;
      }
      try {
        addToCart(product);
        toast.success("Added to cart");
      } catch (error) {
        toast.error("Failed to add to cart");
      }
    },
    [product, addToCart]
  );

  return (
    <div className="bg-white rounded-2xl border-2 border-sky-500 overflow-hidden group flex flex-col h-full">
      {/* Top Half - Image Container */}
      <div
        className={`relative h-1/2 w-full ${useBlueTheme ? "bg-gradient-to-br from-sky-50 to-sky-100" : "bg-gradient-to-br from-green-50 to-green-100"} flex items-center justify-center overflow-hidden`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition duration-300"
            loading="lazy"
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2214%22 fill=%22%239ca3af%22%3EImage not found%3C/text%3E%3C/svg%3E";
            }}
          />
        ) : (
          <div className="text-gray-400 text-center text-sm">No image</div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition duration-300"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={18}
            className={
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
            }
          />
        </button>

        {/* Badge */}
        {product.badge && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            {product.badge}
          </div>
        )}

        {/* Stock Status - Out of Stock Badge */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </div>
          </div>
        )}
      </div>

      {/* Bottom Half - Product Info */}
      <div className="h-1/2 p-4 flex flex-col justify-between space-y-2 overflow-y-auto">
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.map((tag) => (
              <ProductTag key={tag._id || tag.id} tag={tag} />
            ))}
          </div>
        )}

        {/* Product Category */}
        {product.category && (
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {product.category}
          </p>
        )}

        {/* Product Name */}
        <Link to={`/product/${product._id || product.id}`} className="block">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-primary transition duration-300">
            {product.name}
          </h3>
        </Link>

        {/* Brand - Below Product Name */}
        {product.brand && (
          <p className="text-xs font-medium text-primary">{product.brand}</p>
        )}

        {/* Rating & Weight */}
        <div className="flex items-center justify-between">
          <div
            className={`text-sm font-semibold ${useBlueTheme ? "text-primary" : "text-secondary"}`}
          >
            {product.weight || "500g"}
          </div>
          {product.rating && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-xs font-semibold text-gray-700">
                {product.rating}
              </span>
            </div>
          )}
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition duration-300 ${
              product.stock <= 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : useBlueTheme
                  ? "bg-primary text-white hover:bg-blue-700 active:scale-95"
                  : "bg-secondary text-white hover:bg-green-700 active:scale-95"
            }`}
          >
            <ShoppingCart size={16} />
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}
