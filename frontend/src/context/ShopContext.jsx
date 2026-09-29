import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('react_cart') || '[]'));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('react_wishlist') || '[]'));
  const [comboSelection, setComboSelection] = useState(new Map());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  
  // Theme state: default to system preference if no localStorage value
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('react_theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('react_cart', JSON.stringify(cart));
    localStorage.setItem('react_wishlist', JSON.stringify(wishlist));
  }, [cart, wishlist]);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('react_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const toggleWishlistItem = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(x => x !== id));
      showToast('Removed from wishlist');
    } else {
      setWishlist([...wishlist, id]);
      showToast('Added to wishlist');
    }
  };

  const addToCart = (product, size) => {
    if (!size) {
      showToast('Please select a size first');
      return;
    }
    const existing = cart.find(x => x.type === 'single' && x.id === product.id && x.size === size);
    if (existing) {
      setCart(cart.map(x => (x === existing ? { ...x, qty: x.qty + 1 } : x)));
    } else {
      setCart([...cart, { type: 'single', id: product.id, name: product.name, price: product.price, image: product.image, size, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const toggleComboItem = (product, size) => {
    if (comboSelection.has(product.id)) {
      const newMap = new Map(comboSelection);
      newMap.delete(product.id);
      setComboSelection(newMap);
      return;
    }
    if (comboSelection.size >= 3) {
      showToast('Choose only 3 tees for combo');
      return;
    }
    if (!size) {
      showToast('Please select a size for the combo');
      return;
    }
    const newMap = new Map(comboSelection);
    newMap.set(product.id, { size });
    setComboSelection(newMap);
  };

  const addComboToCart = () => {
    if (comboSelection.size !== 3) return;
    const items = [...comboSelection.entries()].map(([id, data]) => {
      const p = products.find(x => x.id === id);
      return { id: p.id, name: p.name, image: p.image, size: data.size };
    });
    setCart([...cart, { type: 'combo', id: 'combo-' + Date.now(), name: '3-Piece Combo', price: 499, image: items[0].image, items, qty: 1 }]);
    setComboSelection(new Map());
    showToast('Combo added to cart');
    setIsCartOpen(true);
  };

  const updateQty = (index, delta) => {
    const newCart = [...cart];
    newCart[index].qty = (newCart[index].qty || 1) + delta;
    if (newCart[index].qty <= 0) {
      newCart.splice(index, 1);
    }
    setCart(newCart);
  };

  const removeItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  return (
    <ShopContext.Provider value={{
      products, fetchProducts,
      cart, wishlist, comboSelection,
      isCartOpen, setIsCartOpen,
      isCheckoutOpen, setIsCheckoutOpen,
      isProductModalOpen, openProductModal, closeProductModal, selectedProduct,
      toastMessage, showToast,
      theme, toggleTheme,
      toggleWishlistItem, addToCart, toggleComboItem, addComboToCart,
      updateQty, removeItem
    }}>
      {children}
    </ShopContext.Provider>
  );
};
