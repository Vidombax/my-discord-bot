const axios = require('axios');
require('dotenv').config();
class GameController {
    async getLuckyGame(req, res) {
        try {
            const response = await axios.get(`https://api.rawg.io/api/games?key=${process.env.RAWG_API}`);
            const countGames = response.data.count;
            if (countGames > 0) {
                const numberGame = Math.floor(Math.random() * countGames);

                console.log(`Номер игры ${numberGame}`);
                const GetGame = await axios.get(`https://api.rawg.io/api/games/${numberGame}?key=${process.env.RAWG_API}`);

                if (GetGame.status === 200) {
                    const genres = [];
                    const tags = [];

                    for (let i = 0; i < GetGame.data.genres.length; i++) {
                        genres.push(GetGame.data.genres[i]);
                    }

                    for (let i = 0; i < GetGame.data.tags.length; i++) {
                        tags.push(GetGame.data.tags[i]);
                    }

                    const game = {
                        name: GetGame.data.name,
                        description: (GetGame.data.description_raw.length < 4097) ? GetGame.data.description_raw : 'Отсутствует',
                        genre: genres[0],
                        tags: tags,
                        image: GetGame.data.background_image,
                    };

                    console.log(`JSON игры ${JSON.stringify(game)}`);
                    res.json(game);
                } else {
                    return new Error("Error");
                }
            }
            else {
                res.json('Что-то пошло не так');
            }
        }
        catch (error) {
            res.json(error.name);
        }
    }
}

module.exports = new GameController();