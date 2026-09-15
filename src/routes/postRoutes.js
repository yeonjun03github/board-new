const express = require('express');
const router = express.Router();
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/upload');

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: 게시글 API
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: 글 목록 조회
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: 글 목록
 */
router.get('/', getPosts);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: 글 상세 조회
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 글 상세 정보
 *       404:
 *         description: 글을 찾을 수 없음
 */
router.get('/:id', getPost);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: 글 작성
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 작성 완료
 *       400:
 *         description: 제목/내용 누락
 */
router.post('/', authMiddleware, upload.single('image'), createPost);

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: 글 수정
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정 완료
 *       403:
 *         description: 본인 글이 아님
 *       404:
 *         description: 글을 찾을 수 없음
 */
router.put('/:id', authMiddleware, updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: 글 삭제
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제 완료
 *       403:
 *         description: 본인 글이 아님
 *       404:
 *         description: 글을 찾을 수 없음
 */
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
