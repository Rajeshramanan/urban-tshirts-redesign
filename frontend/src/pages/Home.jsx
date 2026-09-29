import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

function ProductCard({ p }) {
  const navigate = useNavigate();
  const { wishlist, toggleWishlistItem, comboSelection, toggleComboItem, addToCart } = useShop();
  const [selectedSize, setSelectedSize] = useState('');
  
  const isWishlist = wishlist.includes(p.id);
  const inCombo = comboSelection.has(p.id);

  const handleSelectSize = (e, s) => {
    e.preventDefault();
    setSelectedSize(s);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(p, selectedSize);
  };

  const handleCombo = (e) => {
    e.preventDefault();
    toggleComboItem(p, selectedSize);
  };

  return (
    <div className="card-wrapper">
      <div className="card">
        <div className="card__inner" onClick={() => navigate(`/product/${p.id}`)} style={{ cursor: 'pointer' }}>
          <div className="card__media">
            <img src={p.image} alt={p.name} loading="lazy" />
          </div>
          <div className="card__badge">
            {p.badge && <span className={`badge ${p.badge === 'SALE' ? 'badge--sale' : ''}`}>{p.badge}</span>}
          </div>
          <button 
            className={`wishlist-btn ${isWishlist ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); toggleWishlistItem(p.id); }}
          >
            <svg viewBox="0 0 24 24" fill={isWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" style={{ width: '1.8rem', height: '1.8rem' }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
        <div className="card__content">
          <h3 className="card__heading" onClick={() => navigate(`/product/${p.id}`)} style={{ cursor: 'pointer' }}>{p.name}</h3>
          <div className="price">
            <span className="price__regular">Rs. {p.price}.00</span>
            <span className="price__sale">Rs. 299.00</span>
          </div>
          <div className="product-sizes-inline">
            {p.sizes.map(s => (
              <button 
                key={s}
                className={`size-btn-inline ${selectedSize === s ? 'selected' : ''}`} 
                onClick={(e) => handleSelectSize(e, s)}
              >{s}</button>
            ))}
          </div>
          <div className="card-actions">
            <button className="button button--full-width button--small" onClick={handleAddToCart}>ADD TO CART</button>
            <button className={`button button--full-width button--small button--combo ${inCombo ? 'active' : ''}`} onClick={handleCombo}>
              {inCombo ? "✓ IN COMBO" : "ADD TO ₹499 COMBO"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const { products, comboSelection, addComboToCart } = useShop();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSizeFilter, setSelectedSizeFilter] = useState([]);

  // Filter Logic
  let list = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
  
  if (selectedCategory.length > 0) {
    list = list.filter(p => selectedCategory.includes(p.category));
  }
  if (selectedSizeFilter.length > 0) {
    list = list.filter(p => p.sizes.some(s => selectedSizeFilter.includes(s)));
  }

  if (sort === 'low') list.sort((a, b) => a.price - b.price);
  if (sort === 'high') list.sort((a, b) => b.price - a.price);

  const toggleFilter = (setFn, stateArr, val) => {
    if (stateArr.includes(val)) {
      setFn(stateArr.filter(x => x !== val));
    } else {
      setFn([...stateArr, val]);
    }
  };

  return (
    <>
      <section className="banner">
        <div className="banner__media">
          <img src="/assets/goku.jpg" alt="Banner" />
        </div>
        <div className="banner__content">
          <div className="banner__box">
            <h2 className="banner__heading">UNLEASH YOUR<br/>ANIME HYPE.</h2>
            <div className="banner__text">
              <p>Explore Exclusive Streetwear & Graphic Tees. Built for the Culture.</p>
            </div>
            <div className="banner__buttons">
              <button className="button" onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}>SHOP NOW</button>
            </div>
          </div>
        </div>
      </section>

      <section className="category-icons page-width">
        <div className="category-icon" onClick={() => { setSelectedCategory(['Anime']); document.getElementById('shop').scrollIntoView(); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
          <span>ANIME</span>
        </div>
        <div className="category-icon" onClick={() => { setSelectedCategory(['Graphic']); document.getElementById('shop').scrollIntoView(); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          <span>GRAPHIC</span>
        </div>
        <div className="category-icon" onClick={() => { setSelectedCategory(['Streetwear']); document.getElementById('shop').scrollIntoView(); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12l5.25 5 2.625-5-2.625-5L2 12zm14.75 0l5.25 5-2.625-5 2.625-5-5.25 5zM9 12l2.625 5 2.625-5L11.625 7 9 12z"></path></svg>
          <span>STREETWEAR</span>
        </div>
      </section>

      <section className="page-width" style={{ marginTop: '5rem', marginBottom: '5rem', textAlign: 'center', background: 'var(--bg-secondary)', padding: '4rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h2 className="title" style={{ marginBottom: '1.5rem', color: 'var(--accent)' }}>Pick 3. Pay ₹499.</h2>
        <p style={{ marginBottom: '3rem', color: 'var(--text-secondary)' }}>Select any 3 tees, choose your sizes, and pay one simple combo price.</p>
        <button 
          className={`button ${comboSelection.size === 3 ? '' : 'button--secondary'}`}
          onClick={addComboToCart}
        >
          {comboSelection.size === 3 ? "ADD COMBO TO CART (3/3)" : `SELECT 3 TEES (${comboSelection.size}/3)`}
        </button>
      </section>

      <section id="shop" className="page-width" style={{ marginBottom: '8rem' }}>
        <div className="title-wrapper" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
          <h2 className="title">T-SHIRTS COLLECTION</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Elevate Your Vibe | Filter & Find Your Fit</p>
        </div>
        
        <div className="shop-layout">
          {/* Sidebar Filter */}
          <div className="shop-sidebar">
            <h3 style={{ fontSize: '1.6rem', textTransform: 'uppercase', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>FILTER</h3>
            
            <div style={{ marginBottom: '2.5rem' }}>
              <label className="facet-filters__label">Search</label>
              <input type="text" className="field__input" style={{ width: '100%', marginTop: '1rem' }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <div className="facet-filters__label" style={{ marginBottom: '1rem' }}>COLLECTION</div>
              {['Anime', 'Graphic', 'Streetwear'].map(cat => (
                <label key={cat} style={{ display: 'block', marginBottom: '0.8rem', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                  <input type="checkbox" checked={selectedCategory.includes(cat)} onChange={() => toggleFilter(setSelectedCategory, selectedCategory, cat)} style={{ marginRight: '1rem', accentColor: 'var(--accent)' }} />
                  {cat}
                </label>
              ))}
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <div className="facet-filters__label" style={{ marginBottom: '1rem' }}>SIZE</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['M', 'L', 'XL'].map(sz => (
                  <button 
                    key={sz} 
                    className={`size-btn-inline ${selectedSizeFilter.includes(sz) ? 'selected' : ''}`}
                    onClick={() => toggleFilter(setSelectedSizeFilter, selectedSizeFilter, sz)}
                  >{sz}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <label className="facet-filters__label" style={{ marginBottom: '1rem', display: 'block' }}>SORT BY</label>
              <select className="select__select" style={{ width: '100%' }} value={sort} onChange={e => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="low">Price L-H</option>
                <option value="high">Price H-L</option>
              </select>
            </div>
          </div>
          
          {/* Product Grid */}
          <div>
            <div className="grid">
              {list.length > 0 ? list.map(p => <ProductCard key={p.id} p={p} />) : <p style={{ padding: '4rem', color: 'var(--text-secondary)' }}>No products found matching your filters.</p>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
