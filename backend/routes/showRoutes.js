const express = require('express');
const router = express.Router();
const {
  getAllShows,
  getShowById,
  createShow,
  deleteShow,
} = require('../controllers/showController');
const { protect, requireAdmin } = require('../middleware/auth');

router.get('/', getAllShows);
router.get('/:id', getShowById);
router.post('/', protect, requireAdmin, createShow);
router.delete('/:id', protect, requireAdmin, deleteShow);

module.exports = router;
