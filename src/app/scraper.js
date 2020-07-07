const gplay = require('google-play-scraper');

export async function findAppById(req, res) {
    const {appId} = req.params;
    const app = await gplay.app({appId});
    res.send(app);
}

export async function searchApps(req, res) {
    const {term} = req.params;
    const {count} = req.query;
    const apps = await gplay.search({term, num: count});
    res.send(apps);
}
