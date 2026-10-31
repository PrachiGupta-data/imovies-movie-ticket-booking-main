const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
} = require('../controllers/bookingController');
const { protect, requireAdmin } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/admin/all', protect, requireAdmin, getAllBookings);
router.get('/:id', protect, getBookingById);
router.post('/:id/cancel', protect, cancelBooking);

module.exports = router;
