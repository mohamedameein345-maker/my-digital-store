import React, { useState, useEffect } from 'react';

function App() {
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [products, setProducts] = useState([]);
  // ده لينك السيرفر بتاعك على فيرسيل
 const API_URL = 'https://my-digital-store-six.vercel.app/api/products';
  // دالة لجلب المنتجات من القاعدة
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    alert('تم إضافة المنتج بنجاح!');
    fetchProducts(); // تحديث القائمة فوراً بعد الإضافة
  };

  const deleteProduct = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchProducts(); // تحديث القائمة بعد الحذف
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: 'auto' }}>
      <h1>🛠️ لوحة تحكم المنتجات</h1>
      
      {/* فورمة إضافة منتج جديد */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', border: '1px solid #ddd', padding: '15px' }}>
        <h3>إضافة منتج جديد:</h3>
        <input type="text" placeholder="اسم المنتج" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <input type="number" placeholder="السعر" onChange={(e) => setFormData({...formData, price: e.target.value})} required />
        <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}>إضافة المنتج</button>
      </form>

      <hr />

      {/* عرض المنتجات الحالية */}
      <h3>📦 قائمة المنتجات:</h3>
      <div style={{ display: 'grid', gap: '10px' }}>
        {products.length === 0 ? <p>لا توجد منتجات حالياً.</p> : products.map(product => (
          <div key={product._id} style={{ border: '1px solid #ddd', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{product.name}</strong> - {product.price} جنيه
            </div>
            <button onClick={() => deleteProduct(product._id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>حذف 🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
