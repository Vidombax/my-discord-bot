const {EmbedBuilder} = require("discord.js");
const axios = require("axios");
const striptags = require('striptags');
require('dotenv').config();
module.exports = (client) => {
    const addVideoLink = async (idUser, link) => {
        try {
            if (process.env.TEST_MODE === "ON") {
                const response = await axios.post('http:/localhost:3000/video', {
                    idUser: idUser,
                    link: link,
                });
            }
            else {

            }
        }
        catch (error) {
            console.log(error);
        }
    }

    client.on('interactionCreate', (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        switch (interaction.commandName) {
            case 'add':
                const num1 = interaction.options.get('first-number').value;
                const num2 = interaction.options.get('second-number').value;

                interaction.reply(`Sum would be ${num1 + num2}`);
                break;
            case 'embed':
                const embed = new EmbedBuilder().
                setTitle('Embed title').
                setDescription('This is an embed description').
                setColor('Random').
                addFields({
                    name: 'Field title',
                    value: 'Random value',
                    inline: true
                });

                interaction.reply({ embeds: [embed] });
                break;
            case 'video':
                (async () => {
                    try {
                        if (process.env.TEST_MODE === "ON") {
                            const response = await axios.get('http:/localhost:3000/video');
                            interaction.reply(response.data.link);
                        }
                        else {

                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                })()
                break;
            case 'add-video':
                const link = interaction.options.get('link-to-video').value;
                if (link.includes('https://www.youtube.com/watch')) {
                    addVideoLink(interaction.user.id, link);
                    interaction.reply('Видео было добавлено');
                }
                else {
                    interaction.reply('Текст не имеет ссылки на видео с ютуба');
                }
                break;
            case 'get-lucky':
                (async () => {
                    try {
                        const response = await axios.get(`https://api.rawg.io/api/games?key=${process.env.RAWG_API}`);
                        if (response.data.results.length > 0) {
                            const numberGame = Math.floor(Math.random() * response.data.results.length);
                            const getGame = await axios.get(`https://api.rawg.io/api/games/${numberGame}?key=${process.env.RAWG_API}`);

                            const embed = new EmbedBuilder().
                            setTitle(getGame.data.name).
                            setDescription(striptags(getGame.data.description)).
                            setColor('Random').
                            addFields({
                                name: 'Жанр',
                                value: getGame.data.genres[0].name,
                                inline: true
                            }).
                            addFields({
                                name: 'Тэги',
                                value: `${getGame.data.tags[0].name}, ${getGame.data.tags[1].name}, ${getGame.data.tags[2].name}, ${getGame.data.tags[3].name}`,
                            }).
                            setImage(getGame.data.background_image);

                            interaction.reply( { embeds: [embed] } );
                        }
                        else {
                            console.log(response.data);
                            interaction.reply('Что-то пошло не так');
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                })();
                break;
        }
    });
}
