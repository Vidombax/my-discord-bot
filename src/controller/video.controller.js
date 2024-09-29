const db = require('../handlers/db.js');

class VideoController {
    async createVideoLink(req, res) {
        const idUser = req.body.idUser;
        const link = req.body.link;
        const newVideoLink = await db.query('INSERT INTO linkvideos (link, idUser) VALUES ($1, $2)', [link, idUser]);
        res.json(newVideoLink.rows[0]);
    }
    async getVideo(req, res) {
        const videos = await db.query('SELECT link FROM linkvideos');
        const numberVideo = Math.floor(Math.random() * videos.rows.length);
        res.json(videos.rows[numberVideo]);
    }
}

module.exports = new VideoController();