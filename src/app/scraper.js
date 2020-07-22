const gplay = require('google-play-scraper');

async function findAppById(req, res) {
    const {appId} = req.params;
    try {
        const app = await gplay.app({appId});
        res.send(app);
    } catch (err) {
        if (err.status === 404) {
            res.status(404)
            res.send('App not found')
            return
        }
        res.send(err)
        return
    }
    
}

async function searchApps(req, res) {
    const {term} = req.params;
    const {count} = req.query;
    
    if (isNaN(count)) {
        res.status(400)
        res.send(new Error('count must be a number'))
        return
    }
    if (count < 1) {
        res.status(400)
        res.send(new Error('count must be a positive number'))
        return        
    }
    if (term.length > 100) {
        res.status(400)
        res.send(new Error('term can not be longer than 100 characters'))
        return        
    }

    const apps = await gplay.search({term, num: count});
    res.send(apps);
}

module.exports = {
    searchApps,
    findAppById
};
