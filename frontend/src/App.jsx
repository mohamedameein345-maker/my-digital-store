import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Store from './Store';

function AdminDashboard() {
  const [tab, setTab] = useState('products'); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // --- [جديد] حالة طلبات التفعيل ---
  const [activations, setActivations] = useState([]);

  const [config, setConfig] = useState({
    siteName: 'أكاديمية الكورسات',
    mainColor: '#2ecc71',
    fullSubscriptionPrice: '500',
    logoUrl: '',
    fontFamily: 'Cairo',
    fontWeight: 'bold',
    fontSize: '32',
  });

  const [categories, setCategories] = useState([{ name: 'عام', price: '100' }]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatPrice, setNewCatPrice] = useState('100');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('عام');

  // تأكد أن هذا الرابط يطابق بورت السيرفر عندك
  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => { 
    fetchProducts();
    fetchActivations(); // جلب الطلبات عند فتح اللوحة
    const savedCats = localStorage.getItem('my_custom_categories_v2');
    if (savedCats) setCategories(JSON.parse(savedCats));
    const savedConfig = localStorage.getItem('site_config');
    if (savedConfig) setConfig(JSON.parse(savedConfig));
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products?t=${new Date().getTime()}`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) { console.error("فشل جلب المنتجات"); }
  };

  // --- [جديد] جلب طلبات التفعيل من السيرفر ---
  const fetchActivations = async () => {
    try {
      const res = await fetch(`${API_BASE}/activations`);
      const data = await res.json();
      setActivations(data);
    } catch (err) { console.error("فشل جلب طلبات التفعيل"); }
  };

  // --- [جديد] تفعيل الطلب (حذفه من القائمة بعد التأكد) ---
  const handleApprove = async (id) => {
    if (!window.confirm("هل تأكدت من استلام المبلغ وتريد تفعيل الاشتراك؟")) return;
    try {
      await fetch(`${API_BASE}/activations/${id}`, { method: 'DELETE' });
      alert("تم التفعيل بنجاح! ✅");
      fetchActivations();
    } catch (err) { alert("فشل في التفعيل"); }
  };

  const saveConfig = () => {
    localStorage.setItem('site_config', JSON.stringify(config));
    alert("تم حفظ إعدادات الموقع والأسعار بنجاح! ✨");
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const updatedCats = [...categories, { name: newCatName, price: newCatPrice }];
    setCategories(updatedCats);
    localStorage.setItem('my_custom_categories_v2', JSON.stringify(updatedCats));
    setNewCatName(''); setNewCatPrice('100');
  };

  const deleteCategory = (index) => {
    if (categories[index].name === 'عام') return alert("لا يمكن حذف القسم الافتراضي");
    const updatedCats = categories.filter((_, i) => i !== index);
    setCategories(updatedCats);
    localStorage.setItem('my_custom_categories_v2', JSON.stringify(updatedCats));
  };

  const addProduct = async () => {
    if (!name || !price) return alert("الاسم والسعر مطلوبان");
    setLoading(true);
    try {
      await fetch(API_BASE + '/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price, description, imageUrl, digitalFileUrl: videoUrl, category })
      });
      alert("تمت الإضافة ✅");
      setName(''); setPrice(''); setDescription(''); setImageUrl(''); setVideoUrl('');
      fetchProducts();
    } catch (error) { alert("فشل الاتصال"); }
    finally { setLoading(false); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("حذف الدرس؟")) return;
    await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  return (
    <div dir="rtl" style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Cairo, Arial', backgroundColor: '#f0f2f5' }}>
      
      {/* القائمة الجانبية */}
      <div style={{ width: '260px', backgroundColor: '#2c3e50', color: 'white', padding: '20px', position: 'fixed', height: '100vh' }}>
        <h2 style={{ textAlign: 'center', color: '#2ecc71' }}>لوحة التحكم</h2>
        <hr style={{ borderColor: '#444' }} />
        <button onClick={() => setTab('products')} style={tab === 'products' ? activeSideBtn : sideBtn}>📦 إدارة الدروس</button>
        <button onClick={() => { setTab('activations'); fetchActivations(); }} style={tab === 'activations' ? activeSideBtn : sideBtn}>
          🔔 طلبات التفعيل <span style={badgeStyle}>{activations.length}</span>
        </button>
        <button onClick={() => setTab('categories')} style={tab === 'categories' ? activeSideBtn : sideBtn}>📁 الأقسام والأسعار</button>
        <button onClick={() => setTab('style')} style={tab === 'style' ? activeSideBtn : sideBtn}>🎨 هوية المتجر</button>
        <Link to="/" style={{ ...sideBtn, textDecoration: 'none', display: 'block', textAlign: 'center', marginTop: '30px', backgroundColor: '#e67e22' }}>🏠 معاينة المتجر</Link>
      </div>

      <div style={{ flex: 1, padding: '30px', marginRight: '260px' }}>
        
        {/* تبويب طلبات التفعيل [جديد] */}
        {tab === 'activations' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={cardStyle}>
              <h3>🔔 طلبات الاشتراك الجديدة (بإنتظار التأكد من الدفع)</h3>
              {activations.length === 0 ? <p>لا توجد طلبات معلقة حالياً.</p> : (
                activations.map(req => (
                  <div key={req._id} style={{ ...listCard, borderRightColor: '#f1c40f' }}>
                    <div>
                      <strong>الزبون:</strong> {req.userName} <br/>
                      <strong>الموبايل:</strong> {req.phone} <br/>
                      <strong>الكورس:</strong> {req.category} | <strong>المبلغ:</strong> {req.amount} ج
                    </div>
                    <button onClick={() => handleApprove(req._id)} style={{ ...btnPrimary, width: '120px', backgroundColor: '#27ae60', marginTop: 0 }}>تفعيل الآن ✅</button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* باقي التبويبات (نفس كودك السابق مع تعديلات بسيطة) */}
        {tab === 'style' && (
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={cardStyle}>
              <h3>🎨 مظهر المتجر</h3>
              <input value={config.siteName} onChange={e => setConfig({...config, siteName: e.target.value})} style={inputStyle} placeholder="اسم المتجر" />
              <label>سعر الاشتراك الكامل:</label>
              <input type="number" value={config.fullSubscriptionPrice} onChange={e => setConfig({...config, fullSubscriptionPrice: e.target.value})} style={inputStyle} />
              <button onClick={saveConfig} style={btnPrimary}>حفظ التغييرات ✨</button>
            </div>
          </div>
        )}

        {tab === 'categories' && (
           <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div style={cardStyle}>
                <h3>📁 إضافة قسم جديد</h3>
                <input placeholder="اسم القسم" value={newCatName} onChange={e => setNewCatName(e.target.value)} style={inputStyle} />
                <input placeholder="سعر القسم" type="number" value={newCatPrice} onChange={e => setNewCatPrice(e.target.value)} style={inputStyle} />
                <button onClick={addCategory} style={btnPrimary}>إضافة القسم</button>
              </div>
              {categories.map((c, i) => (
                <div key={i} style={listCard}>
                  <span>{c.name} - {c.price} ج</span>
                  <button onClick={() => deleteCategory(i)} style={{color: 'red', border: 'none', background: 'none'}}>حذف</button>
                </div>
              ))}
           </div>
        )}

        {tab === 'products' && (
           <div style={{ maxWidth: '800px', margin: '0 auto' }}>
             <div style={cardStyle}>
               <h3>➕ إضافة درس</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                 <input placeholder="الاسم" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                 <input placeholder="السعر" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} />
                 <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                   {categories.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                 </select>
                 <input placeholder="رابط الصورة" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={inputStyle} />
                 <input placeholder="رابط الفيديو" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} style={{ ...inputStyle, gridColumn: 'span 2' }} />
               </div>
               <button onClick={addProduct} disabled={loading} style={btnPrimary}>نشر</button>
             </div>
             {products.map(p => (
               <div key={p._id} style={listCard}>
                 <span>{p.name} ({p.category})</span>
                 <button onClick={() => deleteProduct(p._id)} style={{color: 'red', border: 'none', background: 'none'}}>حذف</button>
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );
}

// التنسيقات
const badgeStyle = { backgroundColor: '#e74c3c', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', marginRight: '5px' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', marginBottom: '10px' };
const cardStyle = { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' };
const listCard = { backgroundColor: '#fff', padding: '15px', marginBottom: '10px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRight: '5px solid #2ecc71' };
const btnPrimary = { backgroundColor: '#2ecc71', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%', marginTop: '10px' };
const sideBtn = { width: '100%', padding: '12px', marginBottom: '10px', cursor: 'pointer', backgroundColor: 'transparent', color: '#ecf0f1', border: 'none', textAlign: 'right', borderRadius: '8px' };
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