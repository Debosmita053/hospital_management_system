const express = require('express');
const router = express.Router();
const {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  restockMedicine,
  getLowStockMedicines,
  getExpiredMedicines
} = require('../controllers/medicineController');
const { protect, authorize } = require('../middleware/auth');
const { validateMedicine, validateObjectId, validatePagination } = require('../middleware/validation');

// All routes are protected
router.use(protect);

// Get medicines
router.get('/', validatePagination, getMedicines);

// Get low stock medicines
router.get('/low-stock', authorize('admin'), getLowStockMedicines);

// Get expired medicines
router.get('/expired', authorize('admin'), getExpiredMedicines);

// Get medicine by ID
router.get('/:id', validateObjectId('id'), getMedicineById);

// Create medicine (Admin only)
router.post('/', authorize('admin'), validateMedicine, createMedicine);

// Update medicine (Admin only)
router.put('/:id', authorize('admin'), validateObjectId('id'), updateMedicine);

// Delete medicine (Admin only)
router.delete('/:id', authorize('admin'), validateObjectId('id'), deleteMedicine);

// Restock medicine (Admin only)
router.put('/:id/restock', authorize('admin'), validateObjectId('id'), restockMedicine);

module.exports = router;
