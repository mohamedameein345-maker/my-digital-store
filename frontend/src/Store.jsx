import React, { useState, useEffect } from 'react';

function Store() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // --- حالات نظام التفعيل اليدوي ---
  const [showPayModal, setShowPayModal] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // لمنع التكرار

  const [siteConfig, setSiteConfig] = useState({
    siteName: 'أكاديمية الكورسات الرقمية',
    mainColor: '#2ecc71',
    fullSubscriptionPrice: '500',
    logoUrl: '',
    fontFamily: 'Cairo',
    fontWeight: 'bold',
    fontSize: '32'
  });

  const API_URL = 'https://my-digital-store-six.vercel.app/api';

  useEffect(() => {
    // جلب البيانات الأساسية
    fetch(`${API_URL}/products?t=${new Date().getTime()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        const savedCats = localStorage.getItem('my_custom_categories_v2');
        if (savedCats) {
          setCategories(JSON.parse(savedCats));
        } else {
          const uniqueFromProducts = [...new Set(data.map(p => p.category || 'عام'))];
          setCategories(uniqueFromProducts.map(name => ({ name, price: '0' })));
        }
      })
      .catch(err => console.log("خطأ في جلب المنتجات:", err));

    const savedConfig = localStorage.getItem('site_config');
    if (savedConfig) { setSiteConfig(JSON.parse(savedConfig)); }
  }, []);

  const getActivePrice = () => {
    if (activeCategory === 'الكل') return siteConfig.fullSubscriptionPrice;
    const cat = categories.find(c => c.name === activeCategory);
    return cat ? cat.price : '0';
  };

  // --- وظيفة إرسال طلب التفعيل المحدثة ---
  const submitTransfer = async () => {
    console.log("محاولة إرسال الطلب..."); // للتأكد في الـ Console
    
    if(!buyerName.trim() || !buyerPhone.trim()) {
      return alert("يرجى كتابة الاسم ورقم الموبايل");
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/activations/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: buyerName,
          phone: buyerPhone,
          category: activeCategory,
          amount: getActivePrice()
        })
      });

      if (response.ok) {
        alert(`تم استلام طلبك يا ${buyerName}! ✅\nحول المبلغ الآن لـ 01029973041 وسيتم تفعيل كورس ${activeCategory} فوراً.`);
        setShowPayModal(false);
        setBuyerName(''); setBuyerPhone('');
      } else {
        alert("السيرفر لم يستجب بشكل صحيح، حاول مرة أخرى");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("مشكلة في الاتصال بالسيرفر! تأكد أن الـ Backend يعمل.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filterByCategory = (catName) => {
    setActiveCategory(catName);
    if (catName === 'الكل') { setFilteredProducts(products); }
    else {
      setFilteredProducts(products.filter(p => (p.category || 'عام') === catName));
    }
  };

  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('v=')) { videoId = url.split('v=')[1].split('&')[0]; }
      else { videoId = url.split('/').pop().split('?')[0]; }
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;
    }
    return url;
  };

  return (
    <div dir="rtl" style={{ fontFamily: 'Cairo, Arial', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&family=Amiri:wght@400;700&family=Cairo:wght@400;700;900&family=Changa:wght@400;700&family=Lalezar&family=Tajawal:wght@400;700;900&display=swap" />

      <header style={{ backgroundColor: '#fff', padding: '40px 20px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderTop: `5px solid ${siteConfig.mainColor}` }}>
        <h1 style={{ color: siteConfig.mainColor, margin: '0', fontFamily: siteConfig.fontFamily, fontSize: `${siteConfig.fontSize}px` }}>
          {siteConfig.siteName}
        </h1>
        <p style={{ color: '#666', marginTop: '10px' }}>تعلم مهارات جديدة مع أفضل الدروس الحصرية</p>
      </header>

      {/* شريط الأقسام */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '20px', flexWrap: 'wrap', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => filterByCategory('الكل')} style={{ ...categoryBtn, backgroundColor: activeCategory === 'الكل' ? siteConfig.mainColor : '#eee', color: activeCategory === 'الكل' ? '#fff' : '#555' }}>الكل</button>
        {categories.map((cat, i) => (
          <button key={i} onClick={() => filterByCategory(cat.name)} style={{ ...categoryBtn, backgroundColor: activeCategory === cat.name ? siteConfig.mainColor : '#eee', color: activeCategory === cat.name ? '#fff' : '#555' }}>{cat.name}</button>
        ))}
      </div>

      {/* بنر الاشتراك */}
      <div style={{ textAlign: 'center', padding: '25px', backgroundColor: '#fff', margin: '20px auto', maxWidth: '900px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', border: `1px solid ${siteConfig.mainColor}33` }}>
        <h3 style={{ fontFamily: 'Cairo' }}>🎟️ اشتراك {activeCategory === 'الكل' ? 'الموقع بالكامل' : `قسم ${activeCategory}`}</h3>
        <div style={{ fontSize: '28px', fontWeight: '900', color: siteConfig.mainColor, marginBottom: '15px' }}>{getActivePrice()} جنيهاً</div>
        <button onClick={() => setShowPayModal(true)} style={{ padding: '12px 40px', backgroundColor: siteConfig.mainColor, color: 'white', border: 'none', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px' }}>اشترك الآن وابعث إثبات التحويل 🚀</button>
      </div>

      {/* المنتجات */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', padding: '20px' }}>
        {filteredProducts.map((product) => (
          <div key={product._id} style={{ backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'Cairo' }}>{product.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: siteConfig.mainColor }}>{product.price} ج</span>
                <button onClick={() => setSelectedVideo(product.digitalFileUrl)} style={{ padding: '8px 15px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>مشاهدة 📽️</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- نافذة الدفع --- */}
      {showPayModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '400px', textAlign: 'center' }}>
            <h3 style={{fontFamily: 'Cairo', marginBottom: '10px'}}>💳 تفعيل الاشتراك</h3>
            <p>حول لـ: <strong style={{color: siteConfig.mainColor, fontSize: '22px'}}>01029973041</strong></p>
            
            <input placeholder="اسمك الثنائي" value={buyerName} onChange={e => setBuyerName(e.target.value)} style={inputStyle} />
            <input placeholder="رقم الموبايل اللي حولت منه" value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} style={inputStyle} />
            
            <button 
              onClick={submitTransfer} 
              disabled={isSubmitting}
              style={{ ...btnPrimary, backgroundColor: isSubmitting ? '#ccc' : siteConfig.mainColor }}
            >
              {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب الآن"}
            </button>
            <button onClick={() => setShowPayModal(false)} style={{ ...btnPrimary, backgroundColor: '#95a5a6', marginTop: '10px' }}>إلغاء</button>
          </div>
        </div>
      )}

      {/* مشغل الفيديو */}
      {selectedVideo && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ width: '90%', maxWidth: '900px', position: 'relative' }}>
            <button onClick={() => setSelectedVideo(null)} style={{ position: 'absolute', top: '-40px', right: 0, color: 'white', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>إغلاق [X]</button>
            <div style={{ aspectRatio: '16/9', backgroundColor: '#000', borderRadius: '15px', overflow: 'hidden' }}>
              <iframe width="100%" height="100%" src={getEmbedUrl(selectedVideo)} frameBorder="0" allowFullScreen></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const categoryBtn = { padding: '10px 25px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontFamily: 'Cairo' };
const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', marginBottom: '10px', boxSizing: 'border-box', textAlign: 'center' };
const btnPrimary = { padding: '12px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' };

export default Store;