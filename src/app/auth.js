const jwt = require('jsonwebtoken');
const privateKey = 'VERY_SECRET_KEY';

function getBearerToken(req, res) {
    const {userName, password} = req.query;
    if (!userName || !password) {
        res.status(400);
        return res.send('userName and password are missing');
    }
    const token = jwt.sign({userName, password}, privateKey);
    res.send(token);
}

module.exports = {
    getBearerToken
};
