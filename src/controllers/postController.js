const postService = require('../services/postService');
const handleError = require('../utils/handleError');

// 글 목록 조회
const getPosts = async (req, res) => {
    try {
        const posts = await postService.getPosts();
        res.json(posts);
    } catch (error) {
        handleError(res, error);
    }
};

// 글 상세 조회
const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await postService.getPostById(id);
        res.json(post);
    } catch (error) {
        handleError(res, error);
    }
};

// 글 작성
const createPost = async (req, res) => {
    const { title, content } = req.body;
    const user_id = req.user.id;
    const image = req.file ? '/uploads/' + req.file.filename : null;

    try {
        await postService.createPost({ title, content, image, user_id });
        res.status(201).json({ message: '글 작성 완료' });
    } catch (error) {
        handleError(res, error);
    }
};

// 글 수정
const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const user_id = req.user.id;

    try {
        await postService.updatePost(id, { title, content, user_id });
        res.json({ message: '글 수정 완료' });
    } catch (error) {
        handleError(res, error);
    }
};

// 글 삭제
const deletePost = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        await postService.deletePost(id, user_id);
        res.json({ message: '글 삭제 완료' });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost };
