import axios from 'axios';

// ==========================================
// CONFIGURATION
// ==========================================

export const PAYMENT_CONFIG = {
  // Toggle this to false when ready for production
  DEMO_MODE: true, 
  
  // Replace with your actual Apps Script endpoint when deploying
  PRODUCTION_API_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
  
  // Local Express endpoint (for order creation and demo verification)
  LOCAL_API_URL: 'http://localhost:5000/api',

  // Merchant Details
  MERCHANT_UPI_ID: 'urbantshirts@upi',
  MERCHANT_NAME: 'URBAN T-SHIRTS',
  
  // Placeholder QR Image path (You can replace the actual file later)
  QR_IMAGE_PATH: '/assets/demo-qr.png' 
};

// ==========================================
// API CALLS
// ==========================================

/**
 * Creates an order in the backend database.
 */
export const createOrder = async (customer, items, amount) => {
  try {
    const response = await axios.post(`${PAYMENT_CONFIG.LOCAL_API_URL}/orders`, {
      customer,
      items,
      amount
    });
    return response.data; // Returns order object with orderId
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error('Could not create order. Please try again.');
  }
};

/**
 * Submits the UTR to verify the payment status.
 */
export const verifyUTR = async (orderId, utr) => {
  try {
    // Both DEMO and PROD send the request to our local Express backend.
    // The Express backend acts as a secure middleware and forwards PROD requests 
    // to Google Apps script securely. (Configured in server.js)
    const response = await axios.post(`${PAYMENT_CONFIG.LOCAL_API_URL}/verify-utr`, {
      orderId,
      utr,
      isDemoMode: PAYMENT_CONFIG.DEMO_MODE
    });
    return response.data; // { verified: true/false, message: '...' }
  } catch (error) {
    if (error.response && error.response.data) {
      return error.response.data; // Return the exact error message from backend
    }
    console.error("Error verifying UTR:", error);
    return { verified: false, message: 'Network error. Please try again later.' };
  }
};
