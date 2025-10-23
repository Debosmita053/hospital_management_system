const Medicine = require('../models/Medicine');

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Private
const getMedicines = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    const isActive = req.query.isActive;

    const query = {};

    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } }
      ];
    }

    const medicines = await Medicine.find(query)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Medicine.countDocuments(query);

    res.json({
      success: true,
      data: {
        medicines,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get medicine by ID
// @route   GET /api/medicines/:id
// @access  Private
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    res.json({
      success: true,
      data: medicine
    });
  } catch (error) {
    console.error('Get medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create medicine
// @route   POST /api/medicines
// @access  Private/Admin
const createMedicine = async (req, res) => {
  try {
    const {
      name,
      genericName,
      category,
      description,
      dosage,
      unit,
      manufacturer,
      batchNumber,
      expiryDate,
      quantity,
      minimumStock,
      price,
      isPrescriptionRequired,
      sideEffects,
      contraindications,
      storageConditions
    } = req.body;

    const medicine = await Medicine.create({
      name,
      genericName,
      category,
      description,
      dosage,
      unit,
      manufacturer,
      batchNumber,
      expiryDate: new Date(expiryDate),
      quantity,
      minimumStock,
      price,
      isPrescriptionRequired,
      sideEffects,
      contraindications,
      storageConditions
    });

    res.status(201).json({
      success: true,
      message: 'Medicine created successfully',
      data: medicine
    });
  } catch (error) {
    console.error('Create medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private/Admin
const updateMedicine = async (req, res) => {
  try {
    const {
      name,
      genericName,
      category,
      description,
      dosage,
      unit,
      manufacturer,
      batchNumber,
      expiryDate,
      quantity,
      minimumStock,
      price,
      isPrescriptionRequired,
      sideEffects,
      contraindications,
      storageConditions,
      isActive
    } = req.body;

    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    if (name) medicine.name = name;
    if (genericName) medicine.genericName = genericName;
    if (category) medicine.category = category;
    if (description) medicine.description = description;
    if (dosage) medicine.dosage = dosage;
    if (unit) medicine.unit = unit;
    if (manufacturer) medicine.manufacturer = manufacturer;
    if (batchNumber) medicine.batchNumber = batchNumber;
    if (expiryDate) medicine.expiryDate = new Date(expiryDate);
    if (quantity !== undefined) medicine.quantity = quantity;
    if (minimumStock !== undefined) medicine.minimumStock = minimumStock;
    if (price !== undefined) medicine.price = price;
    if (isPrescriptionRequired !== undefined) medicine.isPrescriptionRequired = isPrescriptionRequired;
    if (sideEffects) medicine.sideEffects = sideEffects;
    if (contraindications) medicine.contraindications = contraindications;
    if (storageConditions) medicine.storageConditions = storageConditions;
    if (isActive !== undefined) medicine.isActive = isActive;

    await medicine.save();

    res.json({
      success: true,
      message: 'Medicine updated successfully',
      data: medicine
    });
  } catch (error) {
    console.error('Update medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    await Medicine.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Medicine deleted successfully'
    });
  } catch (error) {
    console.error('Delete medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Restock medicine
// @route   PUT /api/medicines/:id/restock
// @access  Private/Admin
const restockMedicine = async (req, res) => {
  try {
    const { quantity, batchNumber, expiryDate } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    medicine.quantity += quantity;
    if (batchNumber) medicine.batchNumber = batchNumber;
    if (expiryDate) medicine.expiryDate = new Date(expiryDate);
    medicine.lastRestocked = new Date();

    await medicine.save();

    res.json({
      success: true,
      message: 'Medicine restocked successfully',
      data: medicine
    });
  } catch (error) {
    console.error('Restock medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get low stock medicines
// @route   GET /api/medicines/low-stock
// @access  Private/Admin
const getLowStockMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      $expr: { $lte: ['$quantity', '$minimumStock'] },
      isActive: true
    }).sort({ quantity: 1 });

    res.json({
      success: true,
      data: medicines
    });
  } catch (error) {
    console.error('Get low stock medicines error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get expired medicines
// @route   GET /api/medicines/expired
// @access  Private/Admin
const getExpiredMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      expiryDate: { $lt: new Date() },
      isActive: true
    }).sort({ expiryDate: 1 });

    res.json({
      success: true,
      data: medicines
    });
  } catch (error) {
    console.error('Get expired medicines error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  restockMedicine,
  getLowStockMedicines,
  getExpiredMedicines
};
