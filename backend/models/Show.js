const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theatreName: {
      type: String,
      required: [true, 'Theatre name is required'],
    },
    theatreLocation: {
      type: String,
      default: 'Main Cineplex',
    },
    screenType: {
      type: String,
      enum: ['2D', '3D', 'IMAX 2D', 'IMAX 3D', '4DX'],
      default: '2D',
    },
    showDate: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    showTime: {
      type: String, // e.g. "07:30 PM"
      required: true,
    },
    ticketPrice: {
      regular: { type: Number, default: 200 },
      premium: { type: Number, default: 350 },
      vip: { type: Number, default: 500 },
    },
    bookedSeats: {
      type: [String], // Array of seat IDs like ["A1", "A2", "D5"]
      default: [],
    },
    totalSeats: {
      type: Number,
      default: 60,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Show', showSchema);
