const mongoose = require('mongoose');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const mockStore = require('../mockStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc Get shows with optional filtering by movie and date
// @route GET /api/shows
const getAllShows = async (req, res) => {
  try {
    const { movieId, date } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (movieId) query.movie = movieId;
      if (date) query.showDate = date;

      const shows = await Show.find(query)
        .populate('movie', 'title posterUrl duration language rating')
        .sort({ showDate: 1, showTime: 1 });

      return res.json({ success: true, count: shows.length, shows });
    }

    // In-memory fallback
    let list = [...mockStore.shows];
    if (movieId) {
      list = list.filter((s) => {
        const id = s.movie?._id ? s.movie._id.toString() : s.movie.toString();
        return id === movieId;
      });
    }
    if (date) {
      list = list.filter((s) => s.showDate === date);
    }

    res.json({ success: true, count: list.length, shows: list });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching shows' });
  }
};

// @desc Get single show details by ID (including seat availability)
// @route GET /api/shows/:id
const getShowById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const show = await Show.findById(id).populate('movie');
      if (!show) return res.status(404).json({ message: 'Show not found' });
      return res.json({ success: true, show });
    }

    // In-memory fallback
    const show = mockStore.shows.find((s) => s._id.toString() === id);
    if (!show) return res.status(404).json({ message: 'Show not found' });

    let movieObj = show.movie;
    if (typeof movieObj === 'string') {
      movieObj = mockStore.movies.find((m) => m._id.toString() === movieObj);
    }

    res.json({ success: true, show: { ...show, movie: movieObj } });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching show details' });
  }
};

// @desc Create a new showtime (Admin only)
// @route POST /api/shows
const createShow = async (req, res) => {
  try {
    const { movie, theatreName, theatreLocation, screenType, showDate, showTime, ticketPrice, totalSeats } = req.body;

    if (isDbConnected()) {
      const movieExists = await Movie.findById(movie);
      if (!movieExists) return res.status(404).json({ message: 'Referenced movie does not exist' });

      const show = await Show.create({
        movie,
        theatreName,
        theatreLocation,
        screenType,
        showDate,
        showTime,
        ticketPrice,
        totalSeats: totalSeats || 60,
        bookedSeats: [],
      });

      return res.status(201).json({ success: true, show });
    }

    // In-memory fallback
    const movieObj = mockStore.movies.find((m) => m._id.toString() === movie);
    const newShow = {
      _id: 'mock_s_' + Date.now(),
      movie: movieObj || movie,
      theatreName,
      theatreLocation,
      screenType,
      showDate,
      showTime,
      ticketPrice: ticketPrice || { regular: 200, premium: 350, vip: 500 },
      totalSeats: totalSeats || 60,
      bookedSeats: [],
    };
    mockStore.shows.push(newShow);
    res.status(201).json({ success: true, show: newShow });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error creating show' });
  }
};

// @desc Delete a show (Admin only)
// @route DELETE /api/shows/:id
const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const show = await Show.findByIdAndDelete(id);
      if (!show) return res.status(404).json({ message: 'Show not found' });
      return res.json({ success: true, message: 'Show removed successfully' });
    }

    // In-memory fallback
    mockStore.shows = mockStore.shows.filter((s) => s._id.toString() !== id);
    res.json({ success: true, message: 'Show removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting show' });
  }
};

module.exports = {
  getAllShows,
  getShowById,
  createShow,
  deleteShow,
};
