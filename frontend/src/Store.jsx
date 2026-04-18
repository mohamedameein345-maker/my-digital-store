import React, { useState, useEffect } from 'react';

function Store() {
  const [products, setProducts] = useState([]);
  const API_URL = 'https://my-digital-store-six.vercel.app/api/products';

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("خطأ:", err));
  }, []);

  return (
    <div dir="rtl" style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh', color: '#333' }}>
      
      {/* هيدر شيك ومنظم */}
      <header style={{ backgroundColor: '#fff', padding: '30px 20px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h1 style={{ color: '#2ecc71', margin: '0 0 10px 0', fontSize: '2.5rem' }}>🏪 متجري الرقمي</h1>
        <p style={{ color: '#7f8c8d', fontSize: '1.1rem', margin: 0 }}>أفضل الكورسات والمنتجات الرقمية بين يديك</p>
      </header>

      {/* حاوية المنتجات */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px', padding: '40px 20px' }}>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} style={{ backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', transition: 'transform 0.3s' }}>
              
              {/* عرض صورة المنتج أو شكل افتراضي لو مفيش صورة */}
              <div style={{ width: '100%', height: '200px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '50px' }}>📦</span>
                )}
              </div>

              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '1.4rem' }}>{product.name}</h3>
                <p style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '20px', minHeight: '40px' }}>{product.description}</p>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60', marginBottom: '20px' }}>
                   {product.price} <span style={{ fontSize: '0.9rem' }}>جنيه</span>
                </div>
                <button 
                  onClick={() => alert('سيتم تفعيل الدفع قريباً!')}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                  شراء الآن
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>جاري تحميل المنتجات... ✨</div>
        )}
      </div>

      <footer style={{ textAlign: 'center', padding: '30px', color: '#bdc3c7' }}>
        جميع الحقوق محفوظة لمتجرك الرقمي © 2026
      </footer>
    </div>
  );
}

export default Store;

