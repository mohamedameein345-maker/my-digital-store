import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Store from './Store';

function AdminDashboard() {
  const [tab, setTab] = useState('products'); // التبويب الحالي (منتجات / ستايل)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // خانات إضافة منتج
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('عام'); // القسم

  // خانات إعدادات الموقع (Style)
  const [siteName, setSiteName] = useState('أكاديمية الكورسات');
  const [mainColor, setMainColor] = useState('#2ecc71');

  const API_URL = 'https://my-digital-store-six.vercel.app/api/products';

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}?t=${new Date().getTime()}`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) { console.error("فشل جلب البيانات"); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const addProduct = async () => {
    if (!name || !price) return alert("الاسم والسعر مطلوبان");
    setLoading(true);
    try {
      const response = await fetch(API_URL + '/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, description, imageUrl, digitalFileUrl: videoUrl, category })
      });
      if (response.ok) {
        alert("تمت إضافة الدرس للقسم بنجاح ✅");
        setName(''); setPrice(''); setDescription(''); setImageUrl(''); setVideoUrl('');
        fetchProducts();
      }
    } catch (error) { alert("فشل الاتصال"); }
    finally { setLoading(false); }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("حذف؟")) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  return (
    <div dir="rtl" style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial', backgroundColor: '#f0f2f5' }}>
      
      {/* القائمة الجانبية */}
      <div style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px', boxShadow: '2px 0 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#2ecc71' }}>لوحة التحكم</h2>
        <hr style={{ borderColor: '#444' }} />
        <button onClick={() => setTab('products')} style={tab === 'products' ? activeSideBtn : sideBtn}>📦 إدارة الدروس</button>
        <button onClick={() => setTab('style')} style={tab === 'style' ? activeSideBtn : sideBtn}>🎨 شكل الموقع</button>
        <Link to="/" style={{ ...sideBtn, textDecoration: 'none', display: 'block', textAlign: 'center', marginTop: '50px', backgroundColor: '#e67e22' }}>🏠 معاينة المتجر</Link>
      </div>

      {/* المحتوى الرئيسي */}
      <div style={{ flex: 1, padding: '30px' }}>
        
        {tab === 'products' && (
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={cardStyle}>
              <h3>➕ إضافة درس / كورس جديد</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input placeholder="اسم الدرس" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                <input placeholder="السعر" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} />
                <input placeholder="رابط صورة الغلاف" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={inputStyle} />
                <input placeholder="رابط الفيديو" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} style={inputStyle} />
                
                <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                  <option value="عام">قسم: عام</option>
                  <option value="برمجة">قسم: برمجة</option>
                  <option value="تسويق">قسم: تسويق</option>
                  <option value="تصميم">قسم: تصميم</option>
                </select>

                <textarea placeholder="وصف الدرس" value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, gridColumn: 'span 2' }} />
              </div>
              <button onClick={addProduct} disabled={loading} style={btnPrimary}>
                {loading ? 'جاري الحفظ...' : 'حفظ ونشر الدرس'}
              </button>
            </div>

            <h3 style={{ marginTop: '30px' }}>الدروس المنشورة حالياً:</h3>
            {products.map(p => (
              <div key={p._id} style={listCard}>
                <span><strong>[{p.category}]</strong> {p.name} - {p.price} ج</span>
                <button onClick={() => deleteProduct(p._id)} style={{ color: '#e74c3c', border: 'none', background: 'none', cursor: 'pointer' }}>حذف 🗑️</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'style' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={cardStyle}>
              <h3>🎨 تخصيص هوية الموقع</h3>
              <label>اسم الموقع (يظهر في الهيدر):</label>
              <input value={siteName} onChange={e => setSiteName(e.target.value)} style={inputStyle} />
              
              <label>لون الهوية الأساسي (الأزرار):</label>
              <input type="color" value={mainColor} onChange={e => setMainColor(e.target.value)} style={{ ...inputStyle, height: '50px', padding: '2px' }} />
              
              <p style={{ fontSize: '12px', color: '#666' }}>* الإعدادات دي بتتحكم في شكل "المتجر" للزبائن.</p>
              <button onClick={() => alert('تم حفظ التعديلات (سيتم ربطها برمجياً)')} style={btnPrimary}>حفظ التغييرات</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ستايلات ثابتة
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontSize: '14px' };
const cardStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const listCard = { backgroundColor: '#fff', padding: '15px', marginBottom: '10px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRight: '5px solid #2ecc71' };
const btnPrimary = { backgroundColor: '#2ecc71', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '10px' };
const sideBtn = { width: '100%', padding: '12px', marginBottom: '10px', cursor: 'pointer', backgroundColor: 'transparent', color: '#ecf0f1', border: 'none', textAlign: 'right', borderRadius: '8px', fontSize: '16px' };
const activeSideBtn = { ...sideBtn, backgroundColor: '#34495e', color: '#2ecc71', fontWeight: 'bold' };

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

