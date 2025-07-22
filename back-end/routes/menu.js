const express = require('express');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const firebaseAuth = require('../middleware/firebaseAuth');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Protect all menu routes
router.use(auth);

// GET /api/menu - List all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/menu/:id - Get a menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/menu - Create a new menu item (with image upload)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, category, price, description, availability } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const newItem = new MenuItem({ name, category, price, description, imageUrl, availability });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// PUT /api/menu/:id - Update a menu item (with image upload)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Menu item not found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data', error: err.message });
  }
});

// DELETE /api/menu/:id - Delete a menu item
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Example: Protect a route
router.post('/orders', firebaseAuth, async (req, res) => {
  // req.user contains Firebase user info
  // Handle order placement here
});

module.exports = router; 