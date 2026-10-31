const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const mockStore = require('../mockStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

const generateReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'IM-';
  for (let i = 0; i < 4; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  ref += '-';
  for (let i = 0; i < 4; i++) ref += chars.charAt(Math.floor(Math.random() * chars.length));
  return ref;
};

// @desc Create a new booking
// @route POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { showId, seats, seatDetails, totalAmount } = req.body;
    const userId = req.user.id;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Show ID and at least one seat are required' });
    }

    if (isDbConnected()) {
      const show = await Show.findById(showId);
      if (!show) return res.status(404).json({ message: 'Show not found' });

      const conflictSeats = seats.filter((seat) => show.bookedSeats.includes(seat));
      if (conflictSeats.length > 0) {
        return res.status(409).json({
          message: `Seats already booked: ${conflictSeats.join(', ')}. Please select other seats.`,
        });
      }

      show.bookedSeats.push(...seats);
      await show.save();

      const booking = await Booking.create({
        user: userId,
        show: show._id,
        movie: show.movie,
        seats,
        seatDetails: seatDetails || [],
        totalAmount,
        bookingReference: generateReference(),
        bookingStatus: 'confirmed',
        paymentStatus: 'paid',
      });

      const populatedBooking = await Booking.findById(booking._id)
        .populate('movie')
        .populate('show')
        .populate('user', 'name email phone');

      return res.status(201).json({
        success: true,
        message: 'Booking confirmed successfully!',
        booking: populatedBooking,
      });
    }

    // In-memory fallback
    const show = mockStore.shows.find((s) => s._id.toString() === showId.toString());
    if (!show) return res.status(404).json({ message: 'Show not found' });

    const conflictSeats = seats.filter((seat) => show.bookedSeats.includes(seat));
    if (conflictSeats.length > 0) {
      return res.status(409).json({
        message: `Seats already booked: ${conflictSeats.join(', ')}. Please select other seats.`,
      });
    }

    show.bookedSeats.push(...seats);

    const userObj = mockStore.users.find((u) => u._id.toString() === userId.toString()) || {
      _id: userId,
      name: req.user.name || 'Valued Customer',
      email: req.user.email || 'customer@imovies.com',
    };

    let movieObj = show.movie;
    if (typeof movieObj === 'string') {
      movieObj = mockStore.movies.find((m) => m._id.toString() === movieObj);
    }

    const newBooking = {
      _id: 'mock_b_' + Date.now(),
      user: userObj,
      show: show,
      movie: movieObj,
      seats,
      seatDetails: seatDetails || [],
      totalAmount,
      bookingReference: generateReference(),
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date(),
    };

    mockStore.bookings.unshift(newBooking);

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: newBooking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error processing booking' });
  }
};

// @desc Get current user's bookings
// @route GET /api/bookings/my-bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id.toString();

    if (isDbConnected()) {
      const bookings = await Booking.find({ user: userId })
        .populate('movie')
        .populate('show')
        .sort({ createdAt: -1 });

      return res.json({ success: true, count: bookings.length, bookings });
    }

    // In-memory fallback
    const userBookings = mockStore.bookings.filter((b) => {
      const bUserId = b.user?._id ? b.user._id.toString() : b.user?.toString();
      return bUserId === userId;
    });

    res.json({ success: true, count: userBookings.length, bookings: userBookings });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching user bookings' });
  }
};

// @desc Get single booking by ID
// @route GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const booking = await Booking.findById(id)
        .populate('movie')
        .populate('show')
        .populate('user', 'name email phone');

      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      return res.json({ success: true, booking });
    }

    // In-memory fallback
    const booking = mockStore.bookings.find((b) => b._id.toString() === id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching booking' });
  }
};

// @desc Cancel a booking
// @route POST /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const booking = await Booking.findById(id);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });

      if (booking.bookingStatus === 'cancelled') {
        return res.status(400).json({ message: 'Booking is already cancelled' });
      }

      booking.bookingStatus = 'cancelled';
      booking.paymentStatus = 'refunded';
      await booking.save();

      await Show.findByIdAndUpdate(booking.show, {
        $pull: { bookedSeats: { $in: booking.seats } },
      });

      return res.json({ success: true, message: 'Booking cancelled and seats released successfully' });
    }

    // In-memory fallback
    const booking = mockStore.bookings.find((b) => b._id.toString() === id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';

    const show = mockStore.shows.find(
      (s) => s._id.toString() === (booking.show?._id ? booking.show._id.toString() : booking.show.toString())
    );
    if (show) {
      show.bookedSeats = show.bookedSeats.filter((seat) => !booking.seats.includes(seat));
    }

    res.json({ success: true, message: 'Booking cancelled and seats released successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error cancelling booking' });
  }
};

// @desc Get all bookings across the platform (Admin only)
// @route GET /api/bookings/admin/all
const getAllBookings = async (req, res) => {
  try {
    if (isDbConnected()) {
      const bookings = await Booking.find()
        .populate('user', 'name email phone')
        .populate('movie', 'title posterUrl')
        .populate('show', 'theatreName showDate showTime screenType')
        .sort({ createdAt: -1 });

      return res.json({ success: true, count: bookings.length, bookings });
    }

    // In-memory fallback
    res.json({ success: true, count: mockStore.bookings.length, bookings: mockStore.bookings });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching admin bookings' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
};
