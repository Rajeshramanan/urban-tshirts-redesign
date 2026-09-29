const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// --- Helper Functions ---
function readData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return []; }
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function readOrders() {
  try { return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8')); } catch { return []; }
}
function writeOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// --- Product Endpoints ---
app.get('/api/products', (req, res) => res.json(readData()));

app.post('/api/products', (req, res) => {
  const products = readData();
  const newProduct = { ...req.body, id: 'p' + Date.now() };
  products.push(newProduct);
  writeData(products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const products = readData();
  const index = products.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    writeData(products);
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  let products = readData();
  const initialLength = products.length;
  products = products.filter(p => p.id !== req.params.id);
  if (products.length < initialLength) {
    writeData(products);
    res.json({ message: 'Product deleted' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// --- Checkout & Payment Endpoints ---

// Create an Order
app.post('/api/orders', (req, res) => {
  const { customer, items, amount } = req.body;
  if (!customer || !items || amount == null) return res.status(400).json({ message: 'Invalid order data' });
  
  const d = new Date();
  const orderId = `UT-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const order = {
    orderId,
    customer,
    items,
    amount,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };

  const orders = readOrders();
  orders.push(order);
  writeOrders(orders);

  res.status(201).json(order);
});

// Verify UTR
app.post('/api/verify-utr', (req, res) => {
  const { orderId, utr, isDemoMode } = req.body;
  
  const orders = readOrders();
  const orderIndex = orders.findIndex(o => o.orderId === orderId);
  
  if (orderIndex === -1) return res.status(404).json({ message: 'Order not found' });
  
  const order = orders[orderIndex];

  if (order.status === 'VERIFIED') {
    return res.status(400).json({ message: 'Order is already verified.' });
  }

  // Demo Mode verification
  if (isDemoMode) {
    const validDemoUTRs = ['DEMO123', 'SUCCESS999', 'UTR555'];
    
    if (validDemoUTRs.includes(utr.toUpperCase())) {
      orders[orderIndex].status = 'VERIFIED';
      orders[orderIndex].utr = utr;
      writeOrders(orders);
      return res.json({ verified: true, order: orders[orderIndex], message: 'DEMO — NO REAL PAYMENT. Payment verified successfully.' });
    } else {
      return res.status(400).json({ verified: false, message: 'Transaction not found. Try DEMO123 for testing.' });
    }
  } else {
    // In Production Mode, we would forward the request to the Google Apps Script endpoint here
    // For now, fail gracefully as instructed
    return res.status(501).json({ verified: false, message: 'Production payment endpoint not configured yet.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
