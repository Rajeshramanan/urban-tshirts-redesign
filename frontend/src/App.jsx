import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ProductPage from './pages/ProductPage';
import Toast from './components/Toast';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { useShop } from './context/ShopContext';

function App() {
  const { isCartOpen, isCheckoutOpen, toastMessage } = useShop();

  return (
    <>
      <div className="announcement-bar">
        <p className="announcement-bar__message">🚚 Delivery in 3–4 days • 3 TEES FOR ₹499</p>
      </div>
      <div className="header-wrapper">
        <Header />
      </div>
      
      <main id="MainContent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      
      <Footer />
      
      <div className={`drawer ${isCartOpen ? 'active' : ''}`}>
        <CartDrawer />
      </div>
      
      <div className={`modal ${isCheckoutOpen ? 'active' : ''}`}>
        <CheckoutModal />
      </div>
      
      <Toast message={toastMessage} />
    </>
  );
}

export default App;
