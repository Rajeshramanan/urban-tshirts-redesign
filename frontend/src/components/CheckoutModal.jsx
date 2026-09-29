import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PAYMENT_CONFIG, createOrder, verifyUTR } from '../services/paymentService';

function CheckoutModal() {
  const { cart, setIsCheckoutOpen, showToast, removeItem } = useShop();
  
  // Checkout Steps: 1 = Details, 2 = Payment QR, 3 = Success
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null); // Stores created order from backend
  const [utrInput, setUtrInput] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Form State
  const [name, setName] = useState('John Hon');
  const [phone, setPhone] = useState('(023) 555787');
  const [address, setAddress] = useState('40 88r1 Address\nCity, Mangan\nCountry: United');

  // Calculates subtotal & total based on current cart
  const subtotal = cart.reduce((s, x) => s + (x.price * (x.qty || 1)), 0);
  const shipping = 5.50;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      showToast('Please fill all shipping details');
      return;
    }

    setLoading(true);
    try {
      const customer = { name, phone, address };
      const createdOrder = await createOrder(customer, cart, total);
      setOrderData(createdOrder);
      setStep(2); // Move to Payment Step
    } catch (err) {
      showToast('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUTR = async (e) => {
    e.preventDefault();
    setPaymentError('');
    if (!utrInput.trim()) {
      setPaymentError('Please enter a valid UTR number.');
      return;
    }

    setLoading(true);
    const result = await verifyUTR(orderData.orderId, utrInput);
    setLoading(false);

    if (result.verified) {
      // Move to Confirmation
      setStep(3);
    } else {
      setPaymentError(result.message);
    }
  };

  const closeAndReset = () => {
    setIsCheckoutOpen(false);
    if (step === 3) {
      window.location.reload(); // Clear cart and reload only if order was successful
    }
  };

  return (
    <div className="modal__content" onClick={(e) => e.stopPropagation()}>
      
      {/* Checkout Header */}
      <div style={{ padding: '2.5rem 4rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="title" style={{ fontSize: '2.8rem', margin: 0, textTransform: 'none', fontWeight: 'bold' }}>Secure Checkout</h2>
          <span style={{ fontSize: '1.3rem', color: 'var(--text-secondary)' }}>
            Cart &gt; 
            <strong style={{ color: step === 1 ? 'var(--accent)' : 'inherit', fontWeight: step === 1 ? '600' : 'normal', marginLeft: '0.5rem' }}>Details</strong> &gt; 
            <strong style={{ color: step === 2 ? 'var(--accent)' : 'inherit', fontWeight: step === 2 ? '600' : 'normal', marginLeft: '0.5rem' }}>Payment</strong> &gt; 
            <strong style={{ color: step === 3 ? 'var(--accent)' : 'inherit', fontWeight: step === 3 ? '600' : 'normal', marginLeft: '0.5rem' }}>Confirmation</strong>
          </span>
        </div>
        <button className="modal__close" onClick={closeAndReset} style={{ position: 'relative', top: 0, right: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '2.4rem', height: '2.4rem' }}><path d="M18 6L6 18M6 6l12 12"></path></svg>
        </button>
      </div>

      <div className={`checkout-layout ${step === 3 ? 'checkout-layout--single' : ''}`}>
        
        {/* ======================= STEP 1: DETAILS ======================= */}
        {step === 1 && (
          <>
            <div>
              <h3 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 'bold' }}>
                1. Delivery & Contact Details
              </h3>
              <form id="chkForm" onSubmit={handlePlaceOrder} style={{ background: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div className="field">
                  <label className="field__label">Full Name</label>
                  <input className="field__input" type="text" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="field__label">Phone Number</label>
                  <input className="field__input" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
                <div className="field">
                  <label className="field__label">Delivery Address</label>
                  <textarea className="field__input" style={{ resize: 'vertical', minHeight: '8rem' }} value={address} onChange={e => setAddress(e.target.value)} required></textarea>
                </div>
              </form>
            </div>
            
            {/* Right Col: Order Summary */}
            <div style={{ background: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', alignSelf: 'start', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                Order Summary ({cart.length} Items)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem', maxHeight: '40vh', overflowY: 'auto' }}>
                {cart.map((x, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.5rem', fontSize: '1.3rem', alignItems: 'center' }}>
                    <img src={x.image} alt={x.name} style={{ width: '5rem', height: '6rem', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.3rem' }}>{x.name}</div>
                      <div style={{ color: 'var(--text-secondary)' }}>{x.type === 'combo' ? 'Combo Pack' : x.size}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontWeight: '600' }}>Rs. {x.price * (x.qty || 1)}.00</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.4rem' }}>
                  <span>Subtotal</span><span>Rs. {subtotal}.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', marginBottom: '1.5rem' }}>
                  <span>Shipping</span><span>Rs. {shipping.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginBottom: '2rem', fontSize: '1.8rem', fontWeight: '700' }}>
                <span>Total Payable</span><span style={{ color: 'var(--accent)' }}>Rs. {total.toFixed(2)}</span>
              </div>
              <button type="submit" form="chkForm" className="button button--full-width" disabled={loading} style={{ padding: '1.5rem', fontSize: '1.5rem' }}>
                {loading ? 'Processing...' : `PLACE ORDER & PAY`}
              </button>
            </div>
          </>
        )}

        {/* ======================= STEP 2: PAYMENT (QR) ======================= */}
        {step === 2 && (
          <>
            <div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold' }}>2. Scan & Pay via UPI</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.4rem' }}>
                Please scan the QR code below using any UPI app (GPay, PhonePe, Paytm) to complete your payment.
              </p>
              
              <div style={{ background: 'var(--bg-secondary)', padding: '3rem', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                {PAYMENT_CONFIG.DEMO_MODE && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', background: 'var(--danger)', color: '#fff', padding: '0.8rem', fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    DEMO MODE — NOT A REAL PAYMENT QR
                  </div>
                )}
                
                <div style={{ display: 'inline-block', padding: '1.5rem', background: '#fff', borderRadius: '8px', border: '2px solid var(--border-color)', marginTop: PAYMENT_CONFIG.DEMO_MODE ? '3rem' : '0' }}>
                  <img src={PAYMENT_CONFIG.QR_IMAGE_PATH} alt="UPI QR Code" style={{ width: '200px', height: '200px', display: 'block' }} />
                </div>
                
                <div style={{ marginTop: '2rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', color: 'var(--text-secondary)' }}>UPI ID: <strong>{PAYMENT_CONFIG.MERCHANT_UPI_ID}</strong></p>
                  <p style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-secondary)' }}>Merchant: <strong>{PAYMENT_CONFIG.MERCHANT_NAME}</strong></p>
                </div>
              </div>
              
              <div style={{ marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>Already Paid? Verify Transaction</h3>
                <form onSubmit={handleVerifyUTR} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <input 
                      type="text" 
                      className="field__input" 
                      placeholder="Enter 12-digit UTR Number" 
                      value={utrInput} 
                      onChange={(e) => setUtrInput(e.target.value)}
                      style={{ width: '100%', padding: '1.2rem', fontSize: '1.4rem' }}
                    />
                    {paymentError && <p style={{ color: 'var(--danger)', fontSize: '1.3rem', marginTop: '0.8rem' }}>{paymentError}</p>}
                    {PAYMENT_CONFIG.DEMO_MODE && <p style={{ color: 'var(--accent)', fontSize: '1.2rem', marginTop: '0.8rem' }}>Demo Test UTRs: DEMO123, SUCCESS999</p>}
                  </div>
                  <button type="submit" className="button" disabled={loading} style={{ padding: '1.2rem 3rem', height: '4.7rem' }}>
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Col: Order Payment Summary */}
            <div style={{ background: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', alignSelf: 'start' }}>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>Payment Summary</h3>
              <div style={{ fontSize: '1.4rem', lineHeight: '1.8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Order ID</span>
                  <strong style={{ letterSpacing: '1px' }}>{orderData?.orderId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Customer</span>
                  <strong>{orderData?.customer?.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px dashed var(--border-color)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                  <span style={{ color: '#f39c12', fontWeight: 'bold' }}>{orderData?.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2rem', fontWeight: 'bold' }}>
                  <span>Amount to Pay</span>
                  <span style={{ color: 'var(--accent)' }}>Rs. {orderData?.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ======================= STEP 3: CONFIRMATION ======================= */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', gridColumn: '1 / -1' }}>
            <div style={{ width: '8rem', height: '8rem', background: 'rgba(46, 204, 113, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', color: '#2ecc71' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: '4rem', height: '4rem' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2 className="title" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#2ecc71', textTransform: 'none' }}>Payment Verified Successfully!</h2>
            {PAYMENT_CONFIG.DEMO_MODE && (
               <p style={{ display: 'inline-block', background: 'var(--danger)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '4px', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2rem' }}>DEMO — NO REAL PAYMENT</p>
            )}
            <p style={{ fontSize: '1.6rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '50rem', margin: '0 auto 3rem auto' }}>
              Thank you, {orderData?.customer?.name}. Your order <strong>{orderData?.orderId}</strong> has been placed and payment of <strong>Rs. {orderData?.amount.toFixed(2)}</strong> has been verified.
            </p>
            
            <div style={{ background: 'var(--bg-secondary)', padding: '2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'left', maxWidth: '50rem', margin: '0 auto 4rem auto' }}>
              <h4 style={{ margin: '0 0 1.5rem 0', fontSize: '1.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Delivery Information</h4>
              <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                {orderData?.customer?.address}<br/><br/>
                Phone: {orderData?.customer?.phone}
              </p>
            </div>

            <button className="button" onClick={closeAndReset} style={{ padding: '1.5rem 4rem', fontSize: '1.6rem' }}>
              CONTINUE SHOPPING
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default CheckoutModal;
