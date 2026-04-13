const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    fileUrl: { type: String, required: true },
    coverImage: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);