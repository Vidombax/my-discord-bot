const {EmbedBuilder} = require("discord.js");
const axios = require("axios");
require('dotenv').config();
module.exports = (client) => {
    const addVideoLink = async (idUser, link) => {
        try {
            const response = await axios.post(`${process.env.NODE_ENV}/video`, {
                idUser: idUser,
                link: link,
            });
            console.log(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    function createEmbedGame(data) {
        return new EmbedBuilder()
            .setTitle(data.name)
            .setDescription(data.description)
            .setColor('Random')
            .addFields({
                name: 'Жанр',
                value: (data.genre && data.genre.name) ? data.genre.name : 'Отсутствует',
                inline: true
            })
            .addFields({
                name: 'Теги',
                value: (data.tags && data.tags.length > 0 && data.tags.length > 2)
                    ? `${data.tags[0].name}, ${data.tags[1].name}, ${data.tags[2].name}`
                    : 'Отсутствуют',
            })
            .setImage(data.image);
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
                        const response = await axios.get(`${process.env.NODE_ENV}/video`);
                        interaction.reply(response.data.link);
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
                        const response = await axios.get(`${process.env.NODE_ENV}/lucky-game`);

                        if (response.data !== "AxiosError") {
                            const embed = createEmbedGame(response.data);
                            interaction.reply({embeds: [embed]});
                        }
                        else {
                            const response = await axios.get(`${process.env.NODE_ENV}/lucky-game`);

                            const retryEmbed = createEmbedGame(response.data);
                            interaction.reply({embeds: [retryEmbed]});
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
