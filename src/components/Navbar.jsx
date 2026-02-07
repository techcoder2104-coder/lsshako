import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Heart,
  MoreVertical,
  Truck,
  Package,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingSearches, setTrendingSearches] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const { items, total, getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();

  const cartItems = getCartCount();
  const wishlistItems = getWishlistCount();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery("");
    }
  };

  const handleSearchInputFocus = () => {
    setIsSearchModalOpen(true);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="sticky top-0 bg-white z-50 border-b border-gray-100">
        <div className="px-4 md:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 hover:opacity-80 transition">
              <svg
                width="140"
                height="40"
                viewBox="0 0 180 50"
                className="h-10 w-auto"
              >
                <text
                  x="0"
                  y="38"
                  fontSize="32"
                  fontWeight="900"
                  fontFamily="Arial, sans-serif"
                  letterSpacing="2"
                >
                  <tspan fill="#0EA5E9">t</tspan>
                  <tspan fill="#22C55E">r</tspan>
                  <tspan fill="#0EA5E9">a</tspan>
                  <tspan fill="#22C55E">d</tspan>
                  <tspan fill="#0EA5E9">o</tspan>
                  <tspan fill="#22C55E">n</tspan>
                </text>
              </svg>
            </Link>

            {/* Search Bar */}
            {!isSearchModalOpen && (
              <div className="flex-1 max-w-md hidden md:block">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(searchQuery);
                  }}
                  className="w-full relative"
                >
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder='Search "butter"'
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={handleSearchInputFocus}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:border-primary focus:bg-white transition text-sm"
                  />
                </form>
              </div>
            )}

            {/* Right Menu */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/profile"
                      className="text-sm font-semibold text-gray-800 border border-primary px-3 py-1 rounded-md hover:bg-blue-50 transition cursor-pointer"
                    >
                      {user.name}
                    </Link>

                    {/* Orders Link */}
                    <Link
                      to="/orders"
                      className="flex items-center gap-1 text-gray-600 hover:text-primary transition"
                      title="Orders"
                    >
                      <Package size={18} />
                    </Link>

                    {/* Wishlist Link */}
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 transition relative"
                      title="Wishlist"
                    >
                      <Heart size={18} />
                      {wishlistItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {wishlistItems}
                        </span>
                      )}
                    </Link>

                    {/* Delivery Dashboard Link for Delivery Persons */}
                    {user?.isDeliveryPerson && (
                      <Link
                        to="/delivery"
                        className="flex items-center gap-1 text-orange-600 hover:text-orange-700 transition"
                        title="Delivery Dashboard"
                      >
                        <Truck size={18} />
                      </Link>
                    )}

                    {/* Actions Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowActionsDropdown(!showActionsDropdown)
                        }
                        className="text-gray-500 hover:text-primary transition"
                        title="More actions"
                      >
                        <MoreVertical size={18} />
                      </button>
                      {showActionsDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                          {!user?.isDeliveryPerson && (
                            <Link
                              to="/become-delivery"
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                              onClick={() => setShowActionsDropdown(false)}
                            >
                              <Truck size={16} />
                              <div>
                                <p className="font-semibold text-sm">
                                  Become a Delivery Partner
                                </p>
                                <p className="text-xs text-gray-500">
                                  Join our delivery network
                                </p>
                              </div>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-primary transition"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>

                  <Link
                    to="/cart"
                    className="flex items-center gap-2 bg-secondary hover:bg-green-600 text-white px-4 py-2.5 rounded-lg font-semibold transition relative"
                  >
                    <ShoppingCart size={18} />
                    {cartItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItems}
                      </span>
                    )}
                    <span className="text-sm">{cartItems} items</span>
                    <span className="ml-1">₹{total}</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-primary font-semibold text-sm hover:text-sky-600 transition px-4 py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-secondary text-white font-semibold text-sm hover:bg-green-600 transition px-4 py-2.5 rounded-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition text-gray-700"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 bg-gray-50">
            <div className="p-4 space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(searchQuery);
                  setIsOpen(false);
                }}
                className="relative"
              >
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:border-primary"
                />
              </form>

              <div className="space-y-3">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="block py-2 px-2 border-t border-gray-200 hover:bg-gray-100 rounded-lg transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <p className="text-sm font-semibold text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-600">View Profile</p>
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-2 py-2 px-4 text-gray-700 hover:text-primary font-medium rounded-lg hover:bg-gray-100 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <Package size={18} className="text-primary" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      className="flex items-center gap-2 py-2 px-4 text-gray-700 hover:text-primary font-medium rounded-lg hover:bg-gray-100 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <Heart size={18} className="text-red-600" />
                      <span>Wishlist ({wishlistItems})</span>
                    </Link>

                    {user?.isDeliveryPerson && (
                      <Link
                        to="/delivery"
                        className="flex items-center gap-2 py-2 px-4 text-gray-700 hover:text-primary font-medium rounded-lg hover:bg-gray-100 transition"
                        onClick={() => setIsOpen(false)}
                      >
                        <Truck size={18} className="text-orange-600" />
                        <span>Delivery Dashboard</span>
                      </Link>
                    )}

                    <Link
                      to="/cart"
                      className="flex items-center justify-center gap-2 py-2 px-4 bg-secondary text-white rounded-lg font-semibold hover:bg-green-600 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <ShoppingCart size={18} />
                      <span>
                        Cart ({cartItems}) - ₹{total}
                      </span>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full py-2 px-4 text-gray-700 hover:text-red-600 font-medium text-left border-t border-gray-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block py-2 px-4 text-primary hover:bg-gray-100 font-medium rounded-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block py-2 px-4 bg-secondary text-white rounded-lg font-semibold text-center hover:bg-green-600"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSearch={handleSearch}
      />
    </>
  );
}
