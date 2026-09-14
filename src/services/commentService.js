const pool = require('../config/db');
const AppError = require('../utils/AppError');

const getComments = async (post_id) => {
    const [rows] = await pool.query(
        'SELECT comments.id, comments.content, comments.created_at, comments.user_id, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.post_id = ? ORDER BY comments.created_at ASC',
        [post_id]
    );
    return rows;
};

const createComment = async (post_id, { content, user_id }) => {
    if (!content) {
        throw new AppError(400, '내용을 입력해주세요.');
    }

    await pool.query(
        'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
        [post_id, user_id, content]
    );
};

const deleteComment = async (id, user_id) => {
    const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
    if (rows.length === 0) {
        throw new AppError(404, '댓글을 찾을 수 없습니다. 404');
    }
    if (rows[0].user_id !== user_id) {
        throw new AppError(403, '본인 댓글만 삭제할 수 있습니다. 403');
    }

    await pool.query('DELETE FROM comments WHERE id = ?', [id]);
};

module.exports = { getComments, createComment, deleteComment };
