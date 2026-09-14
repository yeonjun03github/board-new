const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const register = async ({ username, password }) => {
    if (!username || !password) {
        throw new AppError(400, '아이디와 비밀번호를 입력해주세요.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await pool.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new AppError(409, '이미 존재하는 아이디입니다.');
        }
        throw error;
    }
};

const login = async ({ username, password }) => {
    if (!username || !password) {
        throw new AppError(400, '아이디와 비밀번호를 입력해주세요.');
    }

    const [rows] = await pool.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );

    if (rows.length === 0) {
        throw new AppError(401, '아이디 또는 비밀번호가 틀렸습니다.');
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError(401, '아이디 또는 비밀번호가 틀렸습니다.');
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return token;
};

module.exports = { register, login };
