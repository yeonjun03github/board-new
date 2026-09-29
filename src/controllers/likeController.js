const likeService = require('../services/likeService');
const handleError = require('../utils/handleError');

// 좋아요 목록 조회
const getLikes = async (req, res) => {
    try {
        const { id } = req.params;
        const likes = await likeService.getLikes(id);
        res.json(likes);
    } catch (error) {
        handleError(res, error);
    }
};

// 좋아요 토글
const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const result = await likeService.toggleLike(id, user_id);
        res.json(result);
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { getLikes, toggleLike };
