const express = require('express');
const router = express.Router();
const { getComments, createComment, deleteComment } = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: 댓글 API
 */

/**
 * @swagger
 * /comments/{post_id}:
 *   get:
 *     summary: 댓글 목록 조회
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 댓글 목록
 */
router.get('/:post_id', getComments);

/**
 * @swagger
 * /comments/{post_id}:
 *   post:
 *     summary: 댓글 작성
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
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
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: 작성 완료
 *       400:
 *         description: 내용 누락
 */
router.post('/:post_id', authMiddleware, createComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comments]
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
 *         description: 본인 댓글이 아님
 *       404:
 *         description: 댓글을 찾을 수 없음
 */
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
