const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
  digitalFileUrl: { type: String }, // الخانة الجديدة اللي كانت ناقصة
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);