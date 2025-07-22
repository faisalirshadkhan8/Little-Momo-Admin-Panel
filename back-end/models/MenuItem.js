const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Classic Momos',
      'Pan Fried Momos',
      'Creamy Momos',
      'Spicy Gravy Momos',
      'Steak Sauce  Momos',
      'Newly Launched Momos',
      'Noodles',
      'Soups',
      'Chinese Entrees',
      'Chilli Potato',
      'Beverages'
    ],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // Will store the URL or path to the image
  },
  availability: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema); 