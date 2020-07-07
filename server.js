import {isAuthorized} from "./src/middlewares/isAuthorized";
import {findAppById, searchApps} from "./src/app/scraper";
import {getBearerToken} from "./src/app/auth";

const express = require('express');
const server = express();

server.get('/app/:appId', isAuthorized, async (req, res) => {
    return findAppById(req, res);
});

server.get('/app/search/:term', isAuthorized, async (req, res) => {
    return searchApps(req, res);
});

server.get('/auth', (req, res) => {
    return getBearerToken(req, res);
});

server.listen(3000);
