const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// استدعاء الموديلات
const User = require('./models/User');
const Product = require('./models/Product');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage: storage });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('تم الاتصال بالخزنة بنجاح! 😍'))
  .catch(err => console.log(err));

// --- 1. مسار إضافة منتج جديد (محدث لدعم الأقسام) ---
app.post('/api/products/add', upload.single('file'), async (req, res) => {
  try {
    // ضفنا category هنا عشان السيرفر يستلمها من لوحة التحكم
    const { name, price, description, imageUrl, digitalFileUrl, category } = req.body;
    
    const finalFileUrl = req.file 
      ? `https://${req.get('host')}/uploads/${req.file.filename}` 
      : digitalFileUrl;

    const newProduct = new Product({
      name,
      price,
      description,
      imageUrl,
      digitalFileUrl: finalFileUrl,
      category: category || 'عام' // لو مبعتش قسم هيخليها "عام" تلقائياً
    });

    await newProduct.save();
    res.status(201).json({ message: 'تم إضافة المنتج بنجاح! ✅' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 2. مسار عرض كل المنتجات ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // عرض الأحدث أولاً
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 3. مسار حذف منتج ---
app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف المنتج بنجاح! 🗑️' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 4. مسارات المصادقة ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'تم إنشاء حساب المدير بنجاح!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'الإيميل غير موجود' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'الباسورد غلط' });

    const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
    res.json({ token, message: 'تم الدخول بنجاح!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running smoothly! 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`السيرفر يعمل على بورت ${PORT}`));

module.exports = app;