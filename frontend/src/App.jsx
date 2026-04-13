import { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', file: null });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authData, setAuthData] = useState({ email: '', password: '' });

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/products').then(res => res.json()).then(data => setProducts(data));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authData)
    });
    const data = await res.json();
    if (res.ok) { setIsLoggedIn(true); } else { alert(data.message); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('file', formData.file);
    await fetch('http://localhost:5000/api/products', { method: 'POST', body: data });
    setFormData({ name: '', price: '', description: '', file: null });
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-900 dir-rtl" style={{ direction: 'rtl' }}>
      
      {/* Navbar - شريط علوي */}
      <nav className="bg-white shadow-md p-4 mb-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🚀 متجري الرقمي</h1>
          {isLoggedIn && (
            <button onClick={() => setIsLoggedIn(false)} className="text-red-500 font-medium">تسجيل الخروج</button>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4">
        
        {/* لوحة التحكم أو الدخول */}
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold mb-6 text-center">🔑 دخول الإدارة</h3>
            <input type="email" placeholder="الإيميل" onChange={(e) => setAuthData({...authData, email: e.target.value})} className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <input type="password" placeholder="كلمة السر" onChange={(e) => setAuthData({...authData, password: e.target.value})} className="w-full p-3 mb-6 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            <button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300">دخول</button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500 mb-12">
            <h3 className="text-xl font-bold mb-6 text-green-700">➕ إضافة منتج جديد</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="اسم المنتج" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
              <div className="grid grid-cols-2 gap-4">
                 <input type="number" placeholder="السعر ($)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                 <input type="file" onChange={(e) => setFormData({...formData, file: e.target.files[0]})} className="p-2 text-sm border rounded-lg cursor-pointer bg-gray-50" required />
              </div>
              <textarea placeholder="وصف المنتج" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-green-500 outline-none" required />
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg transition duration-300">نشر المنتج الآن 📤</button>
            </form>
          </div>
        )}

        {/* عرض المنتجات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {products.map(p => (
            <div key={p._id} className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 border border-gray-100">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{p.name}</h2>
                <p className="text-gray-600 mb-4 h-12 overflow-hidden text-sm leading-relaxed">{p.description}</p>
                <div className="flex justify-between items-center mt-6">
                  <span className="text-2xl font-extrabold text-blue-600">${p.price}</span>
                  <a href={p.fileUrl} target="_blank" rel="noreferrer" className="bg-gray-800 hover:bg-black text-white px-6 py-2 rounded-full text-sm font-bold transition duration-300">تحميل ⬇️</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
