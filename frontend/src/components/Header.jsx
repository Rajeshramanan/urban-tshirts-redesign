import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

function Header() {
  const { cart, setIsCartOpen, theme, toggleTheme } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const cartCount = cart.reduce((acc, item) => acc + (item.qty || 1), 0);

  return (
    <>
      <header className="header page-width">
        <div className="header__menu-item--mobile">
          <button className="header__icon" onClick={() => setMenuOpen(!menuOpen)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"></path></svg>
          </button>
        </div>
        
        <Link to="/" className="header__heading">
          <img src="/assets/logo.png" alt="URBAN T-SHIRTS" className="header__heading-logo" />
        </Link>
        
        <nav className="header__inline-menu">
          <ul className="list-menu">
            <li><Link to="/" className="list-menu__item">Home</Link></li>
            <li><Link to="/admin" className="list-menu__item">Admin Panel</Link></li>
          </ul>
        </nav>
        
        <div className="header__icons">
          <button className="header__icon" onClick={toggleTheme} title="Toggle Light/Dark Mode">
            {theme === 'light' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg> // Moon
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg> // Sun
            )}
          </button>

          <button className="header__icon" onClick={() => setIsCartOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <div className="cart-count-bubble">{cartCount}</div>
          </button>
        </div>
      </header>
      
      {menuOpen && (
        <nav className="nav-links" style={{ display: 'flex', flexDirection: 'column', background: 'var(--header-bg)', padding: '2rem', position: 'absolute', width: '100%', boxShadow: '0 10px 10px rgba(0,0,0,0.5)', zIndex: 100 }}>
          <ul className="list-menu" style={{ flexDirection: 'column' }}>
            <li><Link to="/" className="list-menu__item" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/admin" className="list-menu__item" onClick={() => setMenuOpen(false)}>Admin Panel</Link></li>
          </ul>
        </nav>
      )}
    </>
  );
}

export default Header;
