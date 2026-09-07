const pool = require('../config/db');

const getComments = async (req, res) => {
    try {
        const { post_id } = req.params;
        const [rows] = await pool.query(
            'SELECT comments.id, comments.content, comments.created_at, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.post_id = ? ORDER BY comments.created_at ASC',
            [post_id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
};

const createComment = async (req, res) => {
    try {
        const { post_id } = req.params;
        const { content } = req.body;
        const user_id = req.user.id;

        if (!content) {
            return res.status(400).json({ message: '내용을 입력해주세요.' });
        }

        await pool.query(
            'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
            [post_id, user_id, content]
        );
        res.status(201).json({ message: '댓글 작성 완료' });
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
        }
        if (rows[0].user_id !== user_id) {
            return res.status(403).json({ message: '본인 댓글만 삭제할 수 있습니다.' });
        }

        await pool.query('DELETE FROM comments WHERE id = ?', [id]);
        res.json({ message: '댓글 삭제 완료' });
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
};

module.exports = { getComments, createComment, deleteComment };