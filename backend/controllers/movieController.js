const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Show = require('../models/Show');
const mockStore = require('../mockStore');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc Get all movies
// @route GET /api/movies
const getAllMovies = async (req, res) => {
  try {
    const { genre, search, status, format, language } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (genre && genre !== 'All') query.genre = { $in: [genre] };
      if (status && status !== 'All') query.status = status;
      if (search) query.title = { $regex: search, $options: 'i' };
      if (format && format !== 'All') query.formats = { $in: [format] };
      if (language && language !== 'All') query.language = { $regex: language, $options: 'i' };

      const movies = await Movie.find(query).sort({ releaseDate: -1 });
      return res.json({ success: true, count: movies.length, movies });
    }

    // In-memory fallback
    let list = [...mockStore.movies];
    if (genre && genre !== 'All') {
      list = list.filter((m) => m.genre?.includes(genre));
    }
    if (status && status !== 'All') {
      list = list.filter((m) => m.status === status);
    }
    if (search) {
      list = list.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (format && format !== 'All') {
      list = list.filter((m) => m.formats?.includes(format));
    }
    if (language && language !== 'All') {
      list = list.filter((m) => m.language?.toLowerCase().includes(language.toLowerCase()));
    }

    res.json({ success: true, count: list.length, movies: list });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching movies' });
  }
};

// @desc Get single movie by ID with its showtimes
// @route GET /api/movies/:id
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const movie = await Movie.findById(id);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
      const shows = await Show.find({ movie: movie._id }).sort({ showDate: 1, showTime: 1 });
      return res.json({ success: true, movie, shows });
    }

    // In-memory fallback
    const movie = mockStore.movies.find((m) => m._id.toString() === id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const shows = mockStore.shows.filter((s) => {
      const movieId = s.movie?._id ? s.movie._id.toString() : s.movie.toString();
      return movieId === id;
    });

    res.json({ success: true, movie, shows });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching movie details' });
  }
};

// @desc Create a new movie (Admin only)
// @route POST /api/movies
const createMovie = async (req, res) => {
  try {
    if (isDbConnected()) {
      const movie = await Movie.create(req.body);
      return res.status(201).json({ success: true, movie });
    }

    // In-memory fallback
    const newMovie = {
      _id: 'mock_m_' + Date.now(),
      ...req.body,
      createdAt: new Date(),
    };
    mockStore.movies.unshift(newMovie);
    res.status(201).json({ success: true, movie: newMovie });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error creating movie' });
  }
};

// @desc Update movie (Admin only)
// @route PUT /api/movies/:id
const updateMovie = async (req, res) => {
  try {
    if (isDbConnected()) {
      const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
      return res.json({ success: true, movie });
    }

    // In-memory fallback
    const idx = mockStore.movies.findIndex((m) => m._id.toString() === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Movie not found' });
    mockStore.movies[idx] = { ...mockStore.movies[idx], ...req.body };
    res.json({ success: true, movie: mockStore.movies[idx] });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error updating movie' });
  }
};

// @desc Delete movie (Admin only)
// @route DELETE /api/movies/:id
const deleteMovie = async (req, res) => {
  try {
    if (isDbConnected()) {
      const movie = await Movie.findByIdAndDelete(req.params.id);
      if (!movie) return res.status(404).json({ message: 'Movie not found' });
      await Show.deleteMany({ movie: req.params.id });
      return res.json({ success: true, message: 'Movie removed successfully' });
    }

    // In-memory fallback
    mockStore.movies = mockStore.movies.filter((m) => m._id.toString() !== req.params.id);
    mockStore.shows = mockStore.shows.filter((s) => {
      const movieId = s.movie?._id ? s.movie._id.toString() : s.movie.toString();
      return movieId !== req.params.id;
    });

    res.json({ success: true, message: 'Movie removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error deleting movie' });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
