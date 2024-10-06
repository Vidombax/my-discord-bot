const {Router} = require('express');
const GameController = require('../controller/game.controller.js');

const router = new Router();

router.get('/lucky-game', GameController.getLuckyGame);
router.get('/find-game-by-name', GameController.getGameByName);

module.exports = router;