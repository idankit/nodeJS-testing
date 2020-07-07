const jwt = require('jsonwebtoken');
const privateKey = 'VERY_SECRET_KEY';

function unauthorizedError(res) {
    res.status(401);
    res.send('Unauthorized user');
}

export async function isAuthorized(req, res, next) {
    const {authorization} = req.headers;
    if (!authorization) {
        unauthorizedError(res);
    }
    const decoded = await jwt.verify(authorization, privateKey);
    if (decoded) {
        next();
    } else {
        unauthorizedError(res);
    }
}
