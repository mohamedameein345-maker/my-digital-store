const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // استدعاء العتّال
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // استدعاء قالب المستخدم
require('dotenv').config();

const Product = require('./models/Product');

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. فتح باب المخزن للجمهور ---
// السطر ده بيخلي أي حد يطلب صورة أو ملف من مجلد uploads السيرفر يبعتهوله فوراً
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 2. قواعد استلام وتسمية الملفات ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // حط الملفات في مجلد uploads
    },
    filename: (req, file, cb) => {
        // سمّي الملف: (تاريخ اللحظة دي) + (اسم الملف الأصلي)
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('تم الاتصال بالخزنة بنجاح! 🥳'))
    .catch(err => console.log(err));

// --- 3. مسار إضافة المنتج (بعد تعديله ليستقبل ملف) ---
// لاحظ كلمة: upload.single('file') هي دي اللي بتفتش في الطرد
app.post('/api/products', upload.single('file'), async (req, res) => {
    try {
        const productData = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            // هنا بنخزن رابط الملف الحقيقي اللي اتسيف في uploads
            fileUrl: `http://localhost:5000/uploads/${req.file.filename}`
        };
        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});
// --- 1. مسار إنشاء حساب مدير (لأول مرة فقط) ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        // تشفير الباسورد عشان لو حد سرق القاعدة ميشوفوش
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'تم إنشاء حساب المدير بنجاح!' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- 2. مسار تسجيل الدخول ---
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'الإيميل غير موجود' });

        // مقارنة الباسورد اللي كتبته باللي متشفر في القاعدة
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'الباسورد غلط' });

        // إعطاء "كارت دخول" (Token) للمتصفح
        const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
        res.json({ token, message: 'تم الدخول بنجاح!' });
   88 } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Final Test: Server is working!');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`السيرفر يعمل بنجاح على بورت ${PORT} 🚀`));
module.exports = app;