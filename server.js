const {isAuthorized} = require('./src/middlewares/isAuthorized');
const {findAppById, searchApps} = require('./src/app/scraper');
const {getBearerToken} = require('./src/app/auth');
const cors = require('cors');

const express = require('express');
const server = express();
server.use(cors());

server.get('/app/:appId', isAuthorized, async (req, res) => {
    return findAppById(req, res);
});

server.get('/app/search/:term', isAuthorized, async (req, res) => {
    return searchApps(req, res);
});

server.get('/auth', (req, res) => {
    return getBearerToken(req, res);
});

console.log('Server is running on port 3000!');
server.listen(3000);
