import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Store from './Store';

function AdminDashboard() {
  const [tab, setTab] = useState('products'); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- إعدادات هوية المتجر والأسعار العامة ---
  const [config, setConfig] = useState({
    siteName: 'أكاديمية الكورسات',
    mainColor: '#2ecc71',
    fullSubscriptionPrice: '500', // سعر الاشتراك في كل الموقع
    logoUrl: '',
    referenceImage: '',
    fontFamily: 'Cairo',
    fontWeight: 'bold',
    fontSize: '32',
  });

  // مصفوفة الأقسام مع أسعارها
  const [categories, setCategories] = useState([
    { name: 'عام', price: '100' }
  ]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatPrice, setNewCatPrice] = useState('100');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [category, setCategory] = useState('عام');

  const API_URL = 'https://my-digital-store-six.vercel.app/api/products';

  useEffect(() => { 
    fetchProducts();
    const savedCats = localStorage.getItem('my_custom_categories_v2');
    if (savedCats) setCategories(JSON.parse(savedCats));

    const savedConfig = localStorage.getItem('site_config');
    if (savedConfig) setConfig(JSON.parse(savedConfig));
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}?t=${new Date().getTime()}`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (err) { console.error("فشل جلب البيانات"); }
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
    setNewCatName('');
    setNewCatPrice('100');
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
      await fetch(API_URL + '/add', {
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

  return (
    <div dir="rtl" style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial', backgroundColor: '#f0f2f5' }}>
      
      {/* القائمة الجانبية */}
      <div style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px' }}>
        <h2 style={{ textAlign: 'center', color: '#2ecc71' }}>لوحة التحكم</h2>
        <hr style={{ borderColor: '#444' }} />
        <button onClick={() => setTab('products')} style={tab === 'products' ? activeSideBtn : sideBtn}>📦 إدارة الدروس</button>
        <button onClick={() => setTab('categories')} style={tab === 'categories' ? activeSideBtn : sideBtn}>📁 الأقسام والأسعار</button>
        <button onClick={() => setTab('style')} style={tab === 'style' ? activeSideBtn : sideBtn}>🎨 هوية المتجر</button>
        <Link to="/" style={{ ...sideBtn, textDecoration: 'none', display: 'block', textAlign: 'center', marginTop: '50px', backgroundColor: '#e67e22' }}>🏠 معاينة المتجر</Link>
      </div>

      <div style={{ flex: 1, padding: '30px' }}>
        
        {/* تبويب الهوية والاشتراك الكامل */}
        {tab === 'style' && (
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={cardStyle}>
              <h3>🎨 مظهر المتجر وتناسب الخطوط</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                <label>اسم المتجر:</label>
                <input value={config.siteName} onChange={e => setConfig({...config, siteName: e.target.value})} style={inputStyle} />
                
                <label style={{color: '#e67e22', fontWeight: 'bold'}}>💰 سعر الاشتراك في "كل الموقع" (جنيهاً):</label>
                <input type="number" value={config.fullSubscriptionPrice} onChange={e => setConfig({...config, fullSubscriptionPrice: e.target.value})} style={{...inputStyle, border: '2px solid #e67e22'}} />

                <label>نوع الخط العربي:</label>
                <select value={config.fontFamily} onChange={e => setConfig({...config, fontFamily: e.target.value})} style={inputStyle}>
                  <option value="Cairo">Cairo (عصري)</option>
                  <option value="Tajawal">Tajawal (ناعم)</option>
                  <option value="Almarai">Almarai (رسمي)</option>
                  <option value="Lalezar">Lalezar (فني/عريض)</option>
                </select>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <input type="number" placeholder="الحجم" value={config.fontSize} onChange={e => setConfig({...config, fontSize: e.target.value})} style={inputStyle} />
                  <input type="color" value={config.mainColor} onChange={e => setConfig({...config, mainColor: e.target.value})} style={{...inputStyle, height: '45px', padding: '2px'}} />
                </div>
                
                <label>رابط اللوجو:</label>
                <input placeholder="Logo URL" value={config.logoUrl} onChange={e => setConfig({...config, logoUrl: e.target.value})} style={inputStyle} />
              </div>
              <button onClick={saveConfig} style={btnPrimary}>حفظ الإعدادات والأسعار ✨</button>
            </div>
          </div>
        )}

        {/* تبويب الأقسام وأسعارها */}
        {tab === 'categories' && (
           <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div style={cardStyle}>
                <h3>📁 إضافة قسم جديد وتحديد سعره</h3>
                <div style={{display: 'flex', gap: '10px', flexDirection: 'column'}}>
                  <input placeholder="اسم القسم (مثلاً: كورس البرمجة)" value={newCatName} onChange={e => setNewCatName(e.target.value)} style={inputStyle} />
                  <input placeholder="سعر الاشتراك في هذا القسم فقط" type="number" value={newCatPrice} onChange={e => setNewCatPrice(e.target.value)} style={inputStyle} />
                  <button onClick={addCategory} style={btnPrimary}>إضافة القسم للقائمة</button>
                </div>
              </div>

              <h3 style={{marginTop: '20px'}}>الأقسام الحالية وأسعارها:</h3>
              {categories.map((c, index) => (
                <div key={index} style={listCard}>
                  <span><strong>{c.name}</strong> - <span style={{color: config.mainColor}}>{c.price} جنيهاً</span></span>
                  <button onClick={() => deleteCategory(index)} style={{color: 'red', border: 'none', background: 'none', cursor: 'pointer'}}>حذف 🗑️</button>
                </div>
              ))}
           </div>
        )}

        {/* تبويب الدروس */}
        {tab === 'products' && (
           <div style={{ maxWidth: '700px', margin: '0 auto' }}>
             <div style={cardStyle}>
               <h3>➕ إضافة درس جديد</h3>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                 <input placeholder="اسم الدرس" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                 <input placeholder="سعر الفيديو المنفرد (اختياري)" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} />
                 <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                   {categories.map((c, i) => <option key={i} value={c.name}>قسم: {c.name}</option>)}
                 </select>
                 <input placeholder="رابط الصورة" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={inputStyle} />
                 <input placeholder="رابط الفيديو" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} style={{ ...inputStyle, gridColumn: 'span 2' }} />
               </div>
               <button onClick={addProduct} disabled={loading} style={btnPrimary}>نشر الدرس</button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', width: '100%', boxSizing: 'border-box' };
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