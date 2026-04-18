import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Store from './Store';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://my-digital-store-six.vercel.app/api/products';

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}?t=${new Date().getTime()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("فشل جلب البيانات");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    if (!name || !price) return alert("الاسم والسعر مطلوبان");
    setLoading(true);
    try {
      const response = await fetch(API_URL + '/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, description, imageUrl, digitalFileUrl: videoUrl })
      });
      if (response.ok) {
        alert("تمت الإضافة ✅");
        setName(''); setPrice(''); setDescription(''); setImageUrl(''); setVideoUrl('');
        fetchProducts();
      } else {
        alert("خطأ في السيرفر - تأكد من عمل Git Push");
      }
    } catch (error) {
      alert("فشل الاتصال");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("حذف؟")) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  return (
    <div dir="rtl" style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center' }}>⚙️ إدارة الكورسات</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="اسم الكورس" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
          <input placeholder="السعر" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} />
          <input placeholder="الوصف" value={description} onChange={e => setDescription(e.target.value)} style={inputStyle} />
          <input placeholder="رابط الصورة" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={inputStyle} />
          <input placeholder="رابط الفيديو" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} style={inputStyle} />
          <button onClick={addProduct} disabled={loading} style={{ backgroundColor: loading ? '#ccc' : '#2ecc71', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'جاري الإضافة...' : 'إضافة للمتجر'}
          </button>
        </div>
      </div>
      <h3 style={{ textAlign: 'center', marginTop: '30px' }}>القائمة الحالية:</h3>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {products && products.length > 0 ? products.map(p => (
          <div key={p._id} style={{ backgroundColor: '#fff', padding: '10px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{p.name} - {p.price} ج</span>
            <button onClick={() => deleteProduct(p._id)} style={{ color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer' }}>حذف 🗑️</button>
          </div>
        )) : <p style={{ textAlign: 'center' }}>لا توجد منتجات حالياً</p>}
      </div>
    </div>
  );
}

const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', outline: 'none' };

function App() {
  return (
    <Router>
      <nav style={{ padding: '15px', backgroundColor: '#2c3e50', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🏠 المتجر</Link>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>⚙️ لوحة التحكم</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

