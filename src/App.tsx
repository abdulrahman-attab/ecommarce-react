import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import { GuestRoute, ProtectedRoute } from './routes';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import Brands from './pages/Brands';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/categories/:categoryId" element={<Products />} />
                  <Route path="/brands" element={<Brands />} />
                  <Route path="/brands/:brandId" element={<Products />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route element={<GuestRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forget-password" element={<ForgotPassword />} />
                  </Route>
                  <Route path="/register" element={<Navigate to="/signup" replace />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/orders" element={<Orders />} />
                    <Route path="/allorders" element={<Navigate to="/profile/orders" replace />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
