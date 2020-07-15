const gplay = require('google-play-scraper');

async function findAppById(req, res) {
    const {appId} = req.params;
    try {
        const app = await gplay.app({appId});
        res.send(app);
    } catch (e) {
        res.status(e.status).send(e.message)
    }
}

async function searchApps(req, res) {
    const {term} = req.params;
    const {count} = req.query;
    const apps = await gplay.search({term, num: count});
    res.send(apps);
}

module.exports = {
    searchApps,
    findAppById
};
