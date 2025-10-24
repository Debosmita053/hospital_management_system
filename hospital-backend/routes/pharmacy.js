const express = require('express');
const { body, validationResult } = require('express-validator');
const Pharmacy = require('../models/Pharmacy');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/pharmacy
// @desc    Get all pharmacy items
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      isLowStock,
      isExpired,
      sortBy = 'name', 
      sortOrder = 'asc' 
    } = req.query;
    
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    let items = await Pharmacy.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Filter by stock status
    if (isLowStock === 'true') {
      items = items.filter(item => item.stock.current <= item.stock.minimum);
    }

    if (isExpired === 'true') {
      const today = new Date();
      items = items.filter(item => item.expiryDate < today);
    }

    const total = await Pharmacy.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get pharmacy items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/pharmacy/:id
// @desc    Get pharmacy item by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Pharmacy.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Pharmacy item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get pharmacy item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/pharmacy
// @desc    Create new pharmacy item
// @access  Private (Admin, Nurse)
router.post('/', auth, authorize('admin', 'nurse'), [
  body('name').notEmpty().trim(),
  body('category').isIn(['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops', 'inhaler', 'other']),
  body('manufacturer').notEmpty().trim(),
  body('price').isFloat({ min: 0 }),
  body('cost').isFloat({ min: 0 }),
  body('stock.current').isInt({ min: 0 }),
  body('stock.minimum').isInt({ min: 0 }),
  body('stock.maximum').isInt({ min: 0 }),
  body('expiryDate').isISO8601(),
  body('batchNumber').notEmpty().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const pharmacy = new Pharmacy(req.body);
    await pharmacy.save();

    res.status(201).json({
      message: 'Pharmacy item created successfully',
      item: pharmacy
    });
  } catch (error) {
    console.error('Create pharmacy item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/pharmacy/:id
// @desc    Update pharmacy item
// @access  Private (Admin, Nurse)
router.put('/:id', auth, authorize('admin', 'nurse'), async (req, res) => {
  try {
    const item = await Pharmacy.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Pharmacy item not found' });
    }

    const updatedItem = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Pharmacy item updated successfully',
      item: updatedItem
    });
  } catch (error) {
    console.error('Update pharmacy item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/pharmacy/:id
// @desc    Delete pharmacy item
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const item = await Pharmacy.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Pharmacy item not found' });
    }

    await Pharmacy.findByIdAndDelete(req.params.id);

    res.json({ message: 'Pharmacy item deleted successfully' });
  } catch (error) {
    console.error('Delete pharmacy item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/pharmacy/:id/stock
// @desc    Update stock for pharmacy item
// @access  Private (Admin, Nurse)
router.put('/:id/stock', auth, authorize('admin', 'nurse'), [
  body('operation').isIn(['add', 'subtract', 'set']),
  body('quantity').isInt({ min: 0 }),
  body('reason').optional().isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { operation, quantity, reason } = req.body;

    const item = await Pharmacy.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Pharmacy item not found' });
    }

    let newStock = item.stock.current;

    switch (operation) {
      case 'add':
        newStock += quantity;
        break;
      case 'subtract':
        newStock = Math.max(0, newStock - quantity);
        break;
      case 'set':
        newStock = quantity;
        break;
    }

    item.stock.current = newStock;
    await item.save();

    res.json({
      message: 'Stock updated successfully',
      item: {
        id: item._id,
        name: item.name,
        currentStock: item.stock.current,
        minimumStock: item.stock.minimum,
        isLowStock: item.stock.current <= item.stock.minimum
      }
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/pharmacy/low-stock
// @desc    Get low stock items
// @access  Private
router.get('/low-stock', auth, async (req, res) => {
  try {
    const items = await Pharmacy.find({ 
      isActive: true,
      $expr: { $lte: ['$stock.current', '$stock.minimum'] }
    }).sort({ 'stock.current': 1 });

    res.json({
      items,
      count: items.length
    });
  } catch (error) {
    console.error('Get low stock items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/pharmacy/expired
// @desc    Get expired items
// @access  Private
router.get('/expired', auth, async (req, res) => {
  try {
    const today = new Date();
    const items = await Pharmacy.find({ 
      isActive: true,
      expiryDate: { $lt: today }
    }).sort({ expiryDate: 1 });

    res.json({
      items,
      count: items.length
    });
  } catch (error) {
    console.error('Get expired items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/pharmacy/dashboard
// @desc    Get pharmacy dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const [
      totalItems,
      lowStockItems,
      expiredItems,
      totalValue
    ] = await Promise.all([
      Pharmacy.countDocuments({ isActive: true }),
      Pharmacy.countDocuments({ 
        isActive: true,
        $expr: { $lte: ['$stock.current', '$stock.minimum'] }
      }),
      Pharmacy.countDocuments({ 
        isActive: true,
        expiryDate: { $lt: new Date() }
      }),
      Pharmacy.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: { $multiply: ['$stock.current', '$cost'] } } } }
      ])
    ]);

    res.json({
      totalItems,
      lowStockItems,
      expiredItems,
      totalValue: totalValue[0]?.total || 0
    });
  } catch (error) {
    console.error('Get pharmacy dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/pharmacy/categories
// @desc    Get pharmacy categories
// @access  Private
router.get('/categories', auth, async (req, res) => {
  try {
    const categories = await Pharmacy.distinct('category', { isActive: true });
    res.json({ categories });
  } catch (error) {
    console.error('Get pharmacy categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;