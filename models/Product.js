const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  description: { 
    type: String 
  },
  imageUrl: { 
    type: String 
  },
  digitalFileUrl: { 
    type: String 
  },
  // الخانة الجديدة لإضافة الأقسام (مثل: كورس البرمجة، كورس التسويق، إلخ)
  category: { 
    type: String, 
    default: 'عام',
    required: true 
  },
  // خانة اختيارية لترتيب الدروس داخل القسم
  categoryOrder: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);