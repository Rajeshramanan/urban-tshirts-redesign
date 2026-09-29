import React, { useState } from 'react';
import axios from 'axios';
import { useShop } from '../context/ShopContext';

function Admin() {
  const { products, fetchProducts, showToast } = useShop();
  
  const [form, setForm] = useState({ name: '', price: '', category: '', image: '', sizes: 'M, L, XL', badge: '' });
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      sizes: form.sizes.split(',').map(s => s.trim())
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, payload);
        showToast('Product updated');
      } else {
        await axios.post('http://localhost:5000/api/products', payload);
        showToast('Product added');
      }
      setForm({ name: '', price: '', category: '', image: '', sizes: 'M, L, XL', badge: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      showToast('Error saving product');
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image,
      sizes: p.sizes.join(', '),
      badge: p.badge || ''
    });
    setEditingId(p.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        showToast('Product deleted');
        fetchProducts();
      } catch (err) {
        showToast('Error deleting product');
      }
    }
  };

  return (
    <div className="page-width" style={{ marginTop: '5rem', marginBottom: '8rem' }}>
      <h2 className="title" style={{ marginBottom: '3rem' }}>Product Manager</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem' }}>
        <div style={{ background: 'rgb(var(--color-base-background-2))', padding: '3rem', borderRadius: '4px' }}>
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
            <div>
              <label className="field__label">Name</label>
              <input className="field__input" type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label className="field__label">Price (₹)</label>
              <input className="field__input" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            </div>
            <div>
              <label className="field__label">Category</label>
              <select className="field__input" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                <option value="">Select...</option>
                <option value="Anime">Anime</option>
                <option value="Graphic">Graphic</option>
                <option value="Streetwear">Streetwear</option>
              </select>
            </div>
            <div>
              <label className="field__label">Image URL / Path</label>
              <input className="field__input" type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="/assets/image.jpg" required />
            </div>
            <div>
              <label className="field__label">Sizes (comma separated)</label>
              <input className="field__input" type="text" value={form.sizes} onChange={e => setForm({...form, sizes: e.target.value})} required />
            </div>
            <div>
              <label className="field__label">Badge (e.g. NEW, SALE)</label>
              <input className="field__input" type="text" value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} />
            </div>
            <button type="submit" className="button" style={{ marginTop: '1rem' }}>
              {editingId ? 'Save Changes' : 'Add Product'}
            </button>
            {editingId && (
              <button type="button" className="button button--secondary" onClick={() => { setEditingId(null); setForm({ name: '', price: '', category: '', image: '', sizes: 'M, L, XL', badge: '' }); }}>
                Cancel
              </button>
            )}
          </form>
        </div>
        
        <div>
          <h3>All Products ({products.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
            {products.map(p => (
              <div key={p.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', border: '1px solid rgba(var(--color-base-text), 0.1)', alignItems: 'center' }}>
                <img src={p.image} alt={p.name} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <strong>{p.name}</strong>
                  <div style={{ fontSize: '1.3rem', color: 'rgba(var(--color-base-text), 0.7)' }}>{p.category} • Rs. {p.price}.00</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="button button--secondary button--small" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="button button--secondary button--small" onClick={() => handleDelete(p.id)} style={{ color: 'red', borderColor: 'red' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
