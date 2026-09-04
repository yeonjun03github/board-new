const express = require('express');
const router = express.Router();
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/upload');

router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/', authMiddleware, upload.single('image'), createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;