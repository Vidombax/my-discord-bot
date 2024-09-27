const db = require('../handlers/db.js');

class VideoController {
    async createVideoLink(req, res) {
        const idUser = req.body.idUser;
        const link = req.body.link;
        const newVideoLink = await db.query('INSERT INTO linkvideos (link, idUser) VALUES ($1, $2)', [link, idUser]);
        res.json(newVideoLink.rows[0]);
    }
}

module.exports = new VideoController();