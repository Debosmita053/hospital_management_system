const express = require('express');
const { body, validationResult } = require('express-validator');
const Room = require('../models/Room');
const Department = require('../models/Department');
const Patient = require('../models/Patient');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/rooms
// @desc    Get all rooms
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      roomType, 
      department, 
      floor,
      isAvailable,
      sortBy = 'roomNumber', 
      sortOrder = 'asc' 
    } = req.query;
    
    const query = { isActive: true };
    
    if (search) {
      query.$or = [
        { roomNumber: { $regex: search, $options: 'i' } },
        { 'department.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (roomType) {
      query.roomType = roomType;
    }
    
    if (department) {
      query.department = department;
    }
    
    if (floor) {
      query.floor = parseInt(floor);
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    let rooms = await Room.find(query)
      .populate('department', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Filter by availability
    if (isAvailable === 'true') {
      rooms = rooms.filter(room => room.availableBeds > 0);
    }

    const total = await Room.countDocuments(query);

    res.json({
      rooms,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/rooms/:id
// @desc    Get room by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('department', 'name description')
      .populate('beds.patient', 'patientId')
      .populate('beds.patient.user', 'firstName lastName');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/rooms
// @desc    Create new room
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), [
  body('roomNumber').notEmpty().trim(),
  body('roomType').isIn(['general', 'private', 'icu', 'emergency', 'operation', 'recovery']),
  body('department').isMongoId(),
  body('floor').isInt({ min: 1 }),
  body('bedCount').isInt({ min: 1 }),
  body('rate').isFloat({ min: 0 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { roomNumber, roomType, department, floor, bedCount, rate, amenities = [] } = req.body;

    // Check if room number already exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    // Check if department exists
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Create beds array
    const beds = [];
    for (let i = 1; i <= bedCount; i++) {
      beds.push({
        bedNumber: `${roomNumber}-${i}`,
        isOccupied: false
      });
    }

    const room = new Room({
      roomNumber,
      roomType,
      department,
      floor,
      bedCount,
      availableBeds: bedCount,
      beds,
      rate,
      amenities
    });

    await room.save();

    const populatedRoom = await Room.findById(room._id)
      .populate('department', 'name');

    res.status(201).json({
      message: 'Room created successfully',
      room: populatedRoom
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/rooms/:id
// @desc    Update room
// @access  Private (Admin only)
router.put('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('department', 'name');

    res.json({
      message: 'Room updated successfully',
      room: updatedRoom
    });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/rooms/:id
// @desc    Delete room
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if room has occupied beds
    const occupiedBeds = room.beds.filter(bed => bed.isOccupied);
    if (occupiedBeds.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete room with occupied beds. Please discharge patients first.' 
      });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/rooms/:id/assign-patient
// @desc    Assign patient to room bed
// @access  Private (Admin, Nurse)
router.post('/:id/assign-patient', auth, authorize('admin', 'nurse'), [
  body('patientId').isMongoId(),
  body('bedNumber').notEmpty().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { patientId, bedNumber } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Find the bed
    const bed = room.beds.find(b => b.bedNumber === bedNumber);
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }

    if (bed.isOccupied) {
      return res.status(400).json({ message: 'Bed is already occupied' });
    }

    // Assign patient to bed
    bed.isOccupied = true;
    bed.patient = patientId;
    bed.admissionDate = new Date();

    // Update patient record
    patient.assignedRoom = room._id;
    patient.status = 'admitted';
    patient.admissionDate = new Date();

    await Promise.all([room.save(), patient.save()]);

    const updatedRoom = await Room.findById(room._id)
      .populate('department', 'name')
      .populate('beds.patient', 'patientId')
      .populate('beds.patient.user', 'firstName lastName');

    res.json({
      message: 'Patient assigned to room successfully',
      room: updatedRoom
    });
  } catch (error) {
    console.error('Assign patient to room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/rooms/:id/discharge-patient
// @desc    Discharge patient from room
// @access  Private (Admin, Nurse)
router.post('/:id/discharge-patient', auth, authorize('admin', 'nurse'), [
  body('patientId').isMongoId(),
  body('bedNumber').notEmpty().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { patientId, bedNumber } = req.body;

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Find the bed
    const bed = room.beds.find(b => b.bedNumber === bedNumber);
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found' });
    }

    if (!bed.isOccupied || bed.patient.toString() !== patientId) {
      return res.status(400).json({ message: 'Patient is not assigned to this bed' });
    }

    // Discharge patient from bed
    bed.isOccupied = false;
    bed.patient = undefined;
    bed.admissionDate = undefined;

    // Update patient record
    const patient = await Patient.findById(patientId);
    if (patient) {
      patient.assignedRoom = undefined;
      patient.status = 'discharged';
      patient.dischargeDate = new Date();
      await patient.save();
    }

    await room.save();

    const updatedRoom = await Room.findById(room._id)
      .populate('department', 'name')
      .populate('beds.patient', 'patientId')
      .populate('beds.patient.user', 'firstName lastName');

    res.json({
      message: 'Patient discharged from room successfully',
      room: updatedRoom
    });
  } catch (error) {
    console.error('Discharge patient from room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/rooms/available
// @desc    Get available rooms
// @access  Private
router.get('/available', auth, async (req, res) => {
  try {
    const { roomType, department, floor } = req.query;

    const query = { 
      isActive: true,
      availableBeds: { $gt: 0 }
    };

    if (roomType) {
      query.roomType = roomType;
    }

    if (department) {
      query.department = department;
    }

    if (floor) {
      query.floor = parseInt(floor);
    }

    const rooms = await Room.find(query)
      .populate('department', 'name')
      .sort({ roomNumber: 1 });

    res.json({
      rooms,
      count: rooms.length
    });
  } catch (error) {
    console.error('Get available rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/rooms/dashboard
// @desc    Get room dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const [
      totalRooms,
      occupiedRooms,
      availableRooms,
      totalBeds,
      occupiedBeds,
      availableBeds
    ] = await Promise.all([
      Room.countDocuments({ isActive: true }),
      Room.countDocuments({ isActive: true, availableBeds: { $lt: { $expr: '$bedCount' } } }),
      Room.countDocuments({ isActive: true, availableBeds: { $gt: 0 } }),
      Room.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$bedCount' } } }
      ]),
      Room.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: { $subtract: ['$bedCount', '$availableBeds'] } } } }
      ]),
      Room.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$availableBeds' } } }
      ])
    ]);

    res.json({
      totalRooms,
      occupiedRooms,
      availableRooms,
      totalBeds: totalBeds[0]?.total || 0,
      occupiedBeds: occupiedBeds[0]?.total || 0,
      availableBeds: availableBeds[0]?.total || 0
    });
  } catch (error) {
    console.error('Get room dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;