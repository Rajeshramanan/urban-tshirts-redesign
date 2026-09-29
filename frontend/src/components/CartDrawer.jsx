import React from 'react';
import { useShop } from '../context/ShopContext';

function CartDrawer() {
  const { cart, updateQty, removeItem, setIsCartOpen, setIsCheckoutOpen } = useShop();
  
  const total = cart.reduce((s, x) => s + (x.price * (x.qty || 1)), 0);

  return (
    <div className="drawer__inner" onClick={(e) => e.stopPropagation()}>
      <div className="drawer__header">
        <h2 className="drawer__heading">Your cart</h2>
        <button className="drawer__close" onClick={() => setIsCartOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
        </button>
      </div>
      <div className="cart-drawer__items">
        {cart.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '5rem' }}>Your cart is empty.</p>
        ) : (
          cart.map((x, i) => {
            const qty = x.qty || 1;
            if (x.type === 'combo') {
              return (
                <div key={i} className="cart-item" style={{ border: '1px solid rgba(var(--color-base-text),0.1)', padding: '1rem' }}>
                  <div className="cart-item__media">
                    <img src={x.image} alt={x.name} />
                  </div>
                  <div className="cart-item__details">
                    <span className="cart-item__name">3-Piece Combo</span>
                    <div className="cart-item__price">Rs. {x.price * qty}.00</div>
                    <div className="cart-item__options">
                      {x.items.map((it, j) => <div key={j}>• {it.name} ({it.size})</div>)}
                    </div>
                    <div className="quantity-wrapper" style={{ marginBottom: '1rem' }}>
                      <button className="quantity__button" onClick={() => updateQty(i, -1)}>-</button>
                      <input className="quantity__input" type="text" value={qty} readOnly />
                      <button className="quantity__button" onClick={() => updateQty(i, 1)}>+</button>
                    </div>
                    <button className="cart-item__remove" onClick={() => removeItem(i)}>Remove</button>
                  </div>
                </div>
              );
            }
            return (
              <div key={i} className="cart-item">
                <div className="cart-item__media">
                  <img src={x.image} alt={x.name} />
                </div>
                <div className="cart-item__details">
                  <span className="cart-item__name">{x.name}</span>
                  <div className="cart-item__price">Rs. {x.price * qty}.00</div>
                  <div className="cart-item__options">Size: {x.size}</div>
                  <div className="quantity-wrapper" style={{ marginBottom: '1rem' }}>
                    <button className="quantity__button" onClick={() => updateQty(i, -1)}>-</button>
                    <input className="quantity__input" type="text" value={qty} readOnly />
                    <button className="quantity__button" onClick={() => updateQty(i, 1)}>+</button>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeItem(i)}>Remove</button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="cart-drawer__footer">
        <div className="totals">
          <h3 className="totals__subtotal">Subtotal</h3>
          <p className="totals__total">Rs. {total}.00</p>
        </div>
        <p style={{ fontSize: '1.2rem', color: 'rgba(18,18,18,0.7)', marginBottom: '2rem' }}>Taxes and shipping calculated at checkout</p>
        <button className="button button--full-width" onClick={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}>CHECKOUT</button>
      </div>
    </div>
  );
}

export default CartDrawer;
