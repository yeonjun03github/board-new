const authService = require('../services/authService');
const handleError = require('../utils/handleError');

const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        await authService.register({ username, password });
        res.status(201).json({ message: '회원가입 성공' });
    } catch (error) {
        handleError(res, error);
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const token = await authService.login({ username, password });
        res.json({ token });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = { register, login };
