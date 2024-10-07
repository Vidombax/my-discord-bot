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
                        genres.push(GetGame.data.genres[i].name);
                    }

                    for (let i = 0; i < GetGame.data.tags.length; i++) {
                        tags.push(GetGame.data.tags[i].name);
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
            const nameGame = req.query.name;

            const response = await axios.get(`https://api.rawg.io/api/games?key=${process.env.RAWG_API}&search=${encodeURIComponent(nameGame)}&search_precise=true`);

            const games = [];
            if (response.data.count > 0) {
                for (let i = 0; i < 7; i++) {
                    if (response.data.results[i].name !== undefined && response.data.results[i].background_image !== null) {
                        const genres = [];
                        const tags = [];
                        const fetchDescription = await axios.get(`https://api.rawg.io/api/games/${response.data.results[i].id}?key=${process.env.RAWG_API}`);
                        const getDescription = fetchDescription.data.description_raw;

                        for (let i = 0; i < response.data.results[i].genres.length; i++) {
                            genres.push(response.data.results[i].genres[i].name);
                        }

                        for (let i = 0; i < response.data.results[i].tags.length; i++) {
                            tags.push(response.data.results[i].tags[i].name);
                        }

                        const game = {
                            name: response.data.results[i].name,
                            description:
                                (getDescription.length < 4097)
                                    ? striptags(
                                        getDescription.
                                        replace(/\n/g, '').
                                        replace(/\r/g, '').
                                        replace(/#/g, ' ')
                                    )
                                    : 'Отсутствует',
                            genre: genres[0],
                            tags: tags,
                            image: response.data.results[i].background_image,
                        };

                        games.push(game);
                    }
                    else {
                        i++;
                    }

                }

                res.json(games);
            }
            else {
                res.json('По такому названию нету игр!');
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}

module.exports = new GameController();