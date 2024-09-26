const {Router} = require('express');
const VideoController = require("../controller/video.controller.js");

const router = new Router();

router.post('/video', VideoController.createVideoLink);

module.exports = router;