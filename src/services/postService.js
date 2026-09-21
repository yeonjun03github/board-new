const pool = require('../config/db'); //경로
const AppError = require('../utils/AppError');

// 글 목록 조회
const getPosts = async () => {
    const [rows] = await pool.query(
        'SELECT posts.id, posts.title, posts.created_at, posts.views, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY posts.created_at DESC'
    );
    return rows;
};

// 글 상세 조회
const getPostById = async (id) => {
    const [rows] = await pool.query(
        'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?',
        [id]
    );
    if (rows.length === 0) {
        throw new AppError(404, '글을 찾을 수 없습니다. 404');
    }

    await pool.query('UPDATE posts SET views = views + 1 WHERE id = ?', [id]);
    rows[0].views += 1;

    return rows[0];
};

// 글 작성
const createPost = async ({ title, content, image, user_id }) => {
    if (!title || !content) {
        throw new AppError(400, '제목과 내용을 입력해주세요.');
    }

    await pool.query(
        'INSERT INTO posts (user_id, title, content, image) VALUES (?, ?, ?, ?)',
        [user_id, title, content, image]
    );
};

// 글 수정
const updatePost = async (id, { title, content, user_id }) => {
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
    if (rows.length === 0) {
        throw new AppError(404, '글을 찾을 수 없습니다. 404');
    }
    if (rows[0].user_id !== user_id) {
        throw new AppError(403, '본인 글만 수정할 수 있습니다. 403');
    }

    await pool.query(
        'UPDATE posts SET title = ?, content = ? WHERE id = ?',
        [title, content, id]
    );
};

// 글 삭제
const deletePost = async (id, user_id) => {
    const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
    if (rows.length === 0) {
        throw new AppError(404, '글을 찾을 수 없습니다. 404');
    }
    if (rows[0].user_id !== user_id) {
        throw new AppError(403, '본인 글만 삭제할 수 있습니다. 403');
    }

    await pool.query('DELETE FROM comments WHERE post_id = ?', [id]);
    await pool.query('DELETE FROM posts WHERE id = ?', [id]);
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };
