const axios = require('axios');
const striptags = require('striptags');
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
    async getGameByName(req, res) {
        try {
            const nameGame = req.body.name;

            const response = await axios.get(`https://api.rawg.io/api/games?key=${process.env.RAWG_API}&search=${nameGame}&search_precise=true`);

            const games = [];
            if (response.data.count > 0) {
                for (let i = 0; i < 3; i++) {
                    const genres = [];
                    const tags = [];
                    const fetchDescription = await axios.get(`https://api.rawg.io/api/games/${response.data.results[i].id}?key=${process.env.RAWG_API}`);
                    const getDescription = fetchDescription.data.description_raw;

                    for (let i = 0; i < response.data.results[i].genres.length; i++) {
                        genres.push(response.data.results[i].genres[i]);
                    }

                    for (let i = 0; i < response.data.results[i].tags.length; i++) {
                        tags.push(response.data.results[i].tags[i]);
                    }

                    const game = {
                        name: response.data.results[i].name,
                        description:
                            (getDescription.length < 4097)
                            ? striptags(
                                getDescription.
                                    replace(/\n/g, '').
                                    replace(/\r/g, ''))
                            : 'Отсутствует',
                        genre: genres[0],
                        tags: tags,
                        image: response.data.results[i].background_image,
                    };

                    games.push(game);
                }

                res.json(games);
            }
            else {
                res.json('Что-то пошло не так');
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}

module.exports = new GameController();