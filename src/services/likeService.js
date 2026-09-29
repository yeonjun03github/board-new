const pool = require('../config/db');

// 특정 글의 좋아요 목록 조회
const getLikes = async (postId) => {
    const [rows] = await pool.query(
        'SELECT user_id FROM likes WHERE post_id = ?',
        [postId]
    );
    return rows;
};

// 좋아요 토글 (눌러져 있으면 취소, 안 눌러져 있으면 추가)
const toggleLike = async (postId, userId) => {
    const [rows] = await pool.query(
        'SELECT * FROM likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
    );

    if (rows.length > 0) {
        await pool.query(
            'DELETE FROM likes WHERE post_id = ? AND user_id = ?',
            [postId, userId]
        );
        return { liked: false };
    }

    await pool.query(
        'INSERT INTO likes (post_id, user_id) VALUES (?, ?)',
        [postId, userId]
    );
    return { liked: true };
};

module.exports = { getLikes, toggleLike };
