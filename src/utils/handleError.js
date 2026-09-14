const handleError = (res, error) => {
    if (error.statusCode) {
        return res.status(error.statusCode).json({ message: error.message });
    }
    res.status(500).json({ message: '서버 오류 500' });
};

module.exports = handleError;
