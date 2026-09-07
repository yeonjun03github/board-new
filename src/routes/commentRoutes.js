const express = require('express');
const router = express.Router();
const { getComments, createComment, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:post_id', getComments);
router.post('/:post_id', authMiddleware, createComment);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;