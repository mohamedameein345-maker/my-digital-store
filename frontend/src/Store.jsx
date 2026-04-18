import React, { useState, useEffect } from 'react';

function Store() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // للمنتجات المفلترة
  const [categories, setCategories] = useState([]); // قائمة الأقسام الفريدة
  const [activeCategory, setActiveCategory] = useState('الكل'); // القسم النشط حالياً
  const [selectedVideo, setSelectedVideo] = useState(null);

  const API_URL = 'https://my-digital-store-six.vercel.app/api/products';

  useEffect(() => {
    fetch(`${API_URL}?t=${new Date().getTime()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        // استخراج الأقسام الفريدة من المنتجات
        const uniqueCategories = ['الكل', ...new Set(data.map(p => p.category || 'عام'))];
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error("خطأ:", err));
  }, []);

  // وظيفة الفلترة عند الضغط على قسم
  const filterByCategory = (cat) => {
    setActiveCategory(cat);
    if (cat === 'الكل') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p => (p.category || 'عام') === cat);
      setFilteredProducts(filtered);
    }
  };

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else {
        videoId = url.split('/').pop().split('?')[0];
      }
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;
    }
    return url;
  };

  return (
    <div dir="rtl" style={{ fontFamily: 'Segoe UI, Arial', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      
      {/* الهيدر المطور */}
      <header style={{ backgroundColor: '#fff', padding: '40px 20px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h1 style={{ color: '#2ecc71', margin: '0', fontSize: '2.5rem', fontWeight: '800' }}>🎓 أكاديمية الكورسات الرقمية</h1>
        <p style={{ color: '#666', marginTop: '10px' }}>تعلم مهارات جديدة مع أفضل الدروس الحصرية</p>
      </header>

      {/* شريط الأقسام (Filter Bar) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '20px', flexWrap: 'wrap', backgroundColor: '#fff', sticky: 'top', zIndex: 100 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => filterByCategory(cat)}
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: '0.3s',
              backgroundColor: activeCategory === cat ? '#2ecc71' : '#eee',
              color: activeCategory === cat ? '#white' : '#555',
              boxShadow: activeCategory === cat ? '0 4px 10px rgba(46, 204, 113, 0.3)' : 'none'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* عرض الكورسات المفلترة */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', padding: '40px 20px' }}>
        {filteredProducts.length > 0 ? filteredProducts.map((product) => (
          <div key={product._id} style={{ backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', transition: '0.3s' }}>
            <div style={{ position: 'relative' }}>
              <img src={product.imageUrl || 'https://via.placeholder.com/300x200'} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'rgba(46, 204, 113, 0.9)', color: 'white', padding: '5px 15px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                {product.category || 'عام'}
              </span>
            </div>
            
            <div style={{ padding: '25px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', color: '#2c3e50' }}>{product.name}</h3>
              <p style={{ color: '#7f8c8d', fontSize: '14px', height: '40px', overflow: 'hidden' }}>{product.description}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#2ecc71' }}>{product.price} <small style={{ fontSize: '12px' }}>جنيه</small></span>
                <button 
                  onClick={() => product.digitalFileUrl ? setSelectedVideo(product.digitalFileUrl) : alert('لا يوجد فيديو')}
                  style={{ padding: '10px 20px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                  ابدأ التعلم 📽️
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: '#999' }}>
            <h2>لا توجد دروس في هذا القسم حالياً 😅</h2>
          </div>
        )}
      </div>

      {/* مودال الفيديو */}
      {selectedVideo && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '900px', position: 'relative' }}>
            <button 
              onClick={() => setSelectedVideo(null)}
              style={{ position: 'absolute', top: '-50px', right: '0', color: 'white', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
              إغلاق [X]
            </button>
            <div style={{ borderRadius: '15px', overflow: 'hidden', boxShadow: '0 0 50px rgba(0,0,0,0.5)', aspectRatio: '16/9' }}>
              {selectedVideo.includes('youtube.com') || selectedVideo.includes('youtu.be') ? (
                <iframe width="100%" height="100%" src={getEmbedUrl(selectedVideo)} frameBorder="0" allowFullScreen></iframe>
              ) : (
                <video controls autoPlay style={{ width: '100%', height: '100%' }}><source src={selectedVideo} type="video/mp4" /></video>
              )}
            </div>
          </div>
        </div>
      )}

      <footer style={{ textAlign: 'center', padding: '40px', color: '#bdc3c7', backgroundColor: '#fff', marginTop: '50px' }}>
        <p>جميع الحقوق محفوظة لأكاديميتك الرقمية © 2026</p>
      </footer>
    </div>
  );
}

export default Store;