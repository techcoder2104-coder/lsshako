import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import Search from './pages/Search'
import Wishlist from './pages/Wishlist'
import BecomeDelivery from './pages/BecomeDelivery'
import DeliveryDashboard from './pages/DeliveryDashboard'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Profile from './pages/Profile'
import PhoneVerification from './pages/Onboarding/PhoneVerification'
import EmailVerification from './pages/Onboarding/EmailVerification'
import AddressForm from './pages/Onboarding/AddressForm'

function AppContent() {
  const location = useLocation()
  const hideNavbar = ['/login', '/register', '/products', '/onboarding/phone', '/onboarding/email', '/onboarding/address'].includes(location.pathname)

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding/phone" element={<PhoneVerification />} />
        <Route path="/onboarding/email" element={<EmailVerification />} />
        <Route path="/onboarding/address" element={<AddressForm />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/become-delivery" element={<BecomeDelivery />} />
        <Route path="/delivery" element={<DeliveryDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
