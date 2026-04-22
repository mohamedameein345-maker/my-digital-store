const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- تعديل سطر الـ CORS لضمان قبول الطلبات من المتصفح ---
app.use(cors({
    origin: '*', // بيسمح لأي رابط يكلم السيرفر (مناسب جداً لفترة التجربة)
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 1. الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('تم الاتصال بالخزنة بنجاح! 😍'))
  .catch(err => console.error('خطأ في الاتصال:', err));

// 2. تعريف شكل بيانات طلبات التفعيل (Schema)
const activationSchema = new mongoose.Schema({
  userName: String,
  phone: String,
  category: String,
  amount: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const Activation = mongoose.model('Activation', activationSchema);

// 3. مسار استقبال الطلبات من الزبائن (المتجر)
app.post('/api/activations/add', async (req, res) => {
  try {
    const { userName, phone, category, amount } = req.body;
    const newRequest = new Activation({ userName, phone, category, amount });
    await newRequest.save();
    res.status(201).json({ message: 'وصلت الرسالة للوحة التحكم! ✅' });
  } catch (error) {
    res.status(500).json({ error: 'السيرفر واجه مشكلة' });
  }
});

// 4. مسار جلب الطلبات (لوحة التحكم)
app.get('/api/activations', async (req, res) => {
  try {
    const requests = await Activation.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. مسار حذف الطلب (لما تدوس "تفعيل" في اللوحة)
app.delete('/api/activations/:id', async (req, res) => {
  try {
    await Activation.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم التفعيل بنجاح' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`السيرفر شغال دلوقت على بورت ${PORT} 🚀`));