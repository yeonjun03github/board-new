const commentService = require('../services/commentService');
const handleError = require('../utils/handleError');

const getComments = async (req, res) => {
    try {
        const { post_id } = req.params;
        const comments = await commentService.getComments(post_id);
        res.json(comments);
    } catch (error) {
        handleError(res, error);
    }
};

const createComment = async (req, res) => {
    try {
        const { post_id } = req.params;
        const { content } = req.body;
        const user_id = req.user.id;

        await commentService.createComment(post_id, { content, user_id });
        res.status(201).json({ message: '댓글이 성공적으로 작성되었습니다!' });
    } catch (error) {
        handleError(res, error);
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        await commentService.deleteComment(id, user_id);
        res.json({ message: '댓글 삭제 완료' });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { getComments, createComment, deleteComment };
