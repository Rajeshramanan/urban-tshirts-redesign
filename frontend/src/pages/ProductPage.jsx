import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, setIsCartOpen, setIsCheckoutOpen, toggleWishlistItem, wishlist } = useShop();
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  
  useEffect(() => {
    const product = products.find(p => p.id === id);
    if (product) {
      setSelectedProduct(product);
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      setQty(1);
    }
  }, [id, products]);

  if (!selectedProduct) return <div className="page-width" style={{ padding: '10rem 2rem', textAlign: 'center', fontSize: '2rem' }}>Product not found.</div>;

  const isWishlist = wishlist.includes(selectedProduct.id);

  const handleAddToCart = () => {
    // Basic add to cart implementation
    // If the user selects qty > 1, we simulate adding multiple by calling addToCart in a loop
    for(let i=0; i<qty; i++) {
      addToCart(selectedProduct, selectedSize);
    }
  };

  return (
    <div className="page-width" style={{ padding: '4rem 2rem' }}>
      
      {/* Breadcrumb */}
      <div style={{ marginBottom: '3rem', fontSize: '1.4rem', color: 'var(--text-secondary)' }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: 'var(--text-primary)' }}>Home</span> &gt; 
        <span style={{ marginLeft: '1rem' }}>Products</span> &gt; 
        <span style={{ marginLeft: '1rem', color: 'var(--accent)' }}>{selectedProduct.name}</span>
      </div>

      <div className="product-page-layout">
        
        {/* Left: Images */}
        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', borderRadius: '12px' }}>
          <div style={{ flex: 1, position: 'relative', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
            <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', aspectRatio: '4/5' }} />
          </div>
          {/* Thumbnails */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div style={{ aspectRatio: '1/1', border: '2px solid var(--accent)', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
              <img src={selectedProduct.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ aspectRatio: '1/1', border: '2px solid transparent', borderRadius: '8px', overflow: 'hidden', background: '#fff', opacity: 0.6 }}>
              <img src={selectedProduct.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ aspectRatio: '1/1', border: '2px solid transparent', borderRadius: '8px', overflow: 'hidden', background: '#fff', opacity: 0.6 }}>
              <img src={selectedProduct.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div style={{ padding: '2rem 0' }}>
          <h1 className="title" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', textTransform: 'none', lineHeight: '1.2' }}>{selectedProduct.name}</h1>
          
          <div style={{ fontSize: '2.4rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            Rs. {selectedProduct.price}.00
            <span style={{ fontSize: '1.6rem', color: 'var(--text-secondary)', textDecoration: 'line-through', fontWeight: 'normal' }}>Rs. 299.00</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', color: 'var(--accent)' }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ width: '1.8rem', height: '1.8rem' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              ))}
            </div>
            <span style={{ fontSize: '1.4rem', color: 'var(--text-secondary)' }}>4.8 (137 reviews)</span>
          </div>

          <p style={{ fontSize: '1.6rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '3rem' }}>
            Premium cotton tee featuring exclusive artwork. Designed for comfort and style. Short sleeves, standard fit. Durable print that survives everyday hustle.
          </p>

          <div style={{ marginBottom: '3rem' }}>
            <label style={{ display: 'block', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: '600', textTransform: 'uppercase' }}>Size Selector</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {selectedProduct.sizes?.map(s => (
                <button 
                  key={s}
                  className={`size-btn-inline ${selectedSize === s ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(s)}
                  style={{ padding: '1.2rem 2rem', fontSize: '1.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', minWidth: '5rem' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '4rem' }}>
            <label style={{ display: 'block', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: '600', textTransform: 'uppercase' }}>Quantity</label>
            <div className="quantity-wrapper" style={{ height: '5rem' }}>
              <button className="quantity__button" onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: '5rem' }}>-</button>
              <input className="quantity__input" type="text" value={qty} readOnly style={{ width: '6rem', fontSize: '1.8rem' }} />
              <button className="quantity__button" onClick={() => setQty(qty + 1)} style={{ width: '5rem' }}>+</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
            <button className="button button--full-width" onClick={handleAddToCart} style={{ fontSize: '1.6rem', padding: '1.8rem', borderRadius: '4px' }}>
              ADD TO CART
            </button>
            <button className="button button--full-width button--secondary" onClick={() => { handleAddToCart(); setIsCartOpen(true); setIsCheckoutOpen(true); }} style={{ fontSize: '1.6rem', padding: '1.8rem', borderRadius: '4px' }}>
              BUY NOW
            </button>
          </div>

          <div style={{ display: 'flex', gap: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '3rem', marginBottom: '4rem' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.4rem', color: 'var(--accent)', fontWeight: '600' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '1.8rem', height: '1.8rem' }}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
              Size Chart
            </button>
            <button onClick={() => toggleWishlistItem(selectedProduct.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.4rem', color: 'var(--accent)', fontWeight: '600' }}>
              <svg viewBox="0 0 24 24" fill={isWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" style={{ width: '1.8rem', height: '1.8rem' }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              Wishlist
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.4rem', color: 'var(--accent)', fontWeight: '600' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '1.8rem', height: '1.8rem' }}><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              Share
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem' }}>
            <div>
              <h4 style={{ fontSize: '1.6rem', textTransform: 'uppercase', marginBottom: '2rem', fontWeight: 'bold' }}>Features</h4>
              <ul style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', paddingLeft: '2rem', lineHeight: '1.8' }}>
                <li>100% premium cotton tee</li>
                <li>Exclusive streetwear artwork</li>
                <li>Designed for comfort and style</li>
                <li>Short sleeves, standard fit</li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.6rem', textTransform: 'uppercase', marginBottom: '2rem', fontWeight: 'bold' }}>Fabric & Care</h4>
              <div style={{ display: 'flex', gap: '3rem' }}>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '3.6rem', height: '3.6rem', marginBottom: '1rem', color: 'var(--text-primary)' }}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  <div style={{ fontSize: '1.2rem' }}>100%<br/>Cotton</div>
                </div>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '3.6rem', height: '3.6rem', marginBottom: '1rem', color: 'var(--text-primary)' }}><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  <div style={{ fontSize: '1.2rem' }}>Made in<br/>India</div>
                </div>
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '3.6rem', height: '3.6rem', marginBottom: '1rem', color: 'var(--text-primary)' }}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><circle cx="12" cy="12" r="3"></circle><path d="M12 2v2M12 20v2M2 12h2M20 12h2"></path></svg>
                  <div style={{ fontSize: '1.2rem' }}>Machine<br/>Wash Cold</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductPage;
