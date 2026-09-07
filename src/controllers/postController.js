const pool = require('../config/db');
const upload = require('../config/upload');

// 글 목록 조회
const getPosts = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT posts.id, posts.title, posts.created_at, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
};

// 글 상세 조회
const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?',
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: '글을 찾을 수 없습니다.' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
};

// 글 작성
const createPost = async (req, res) => {
    const { title, content } = req.body;
    const user_id = req.user.id;
    const image = req.file ? '/uploads/' + req.file.filename : null;

    if (!title || !content) {
        return res.status(400).json({ message: '제목과 내용을 입력해주세요.' });
    }

    try {
        await pool.query(
            'INSERT INTO posts (user_id, title, content, image) VALUES (?, ?, ?, ?)',
            [user_id, title, content, image]
        );
        res.status(201).json({ message: '글 작성 완료' });
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
};

// 글 수정
const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const user_id = req.user.id;

    try {
        const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: '글을 찾을 수 없습니다.' });
        }
        if (rows[0].user_id !== user_id) {
            return res.status(403).json({ message: '본인 글만 수정할 수 있습니다.' });
        }

        await pool.query(
            'UPDATE posts SET title = ?, content = ? WHERE id = ?',
            [title, content, id]
        );
        res.json({ message: '글 수정 완료' });
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
};

// 글 삭제
const deletePost = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: '글을 찾을 수 없습니다.' });
        }
        if (rows[0].user_id !== user_id) {
            return res.status(403).json({ message: '본인 글만 삭제할 수 있습니다.' });
        }

        await pool.query('DELETE FROM comments WHERE post_id = ?', [id]);
        await pool.query('DELETE FROM posts WHERE id = ?', [id]);
        res.json({ message: '글 삭제 완료' });
    } catch (error) {
        console.error('deletePost 에러:', error);
        res.status(500).json({ message: '서버 오류' });
    }
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost };