const {EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
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
                value: (data.genre) ? data.genre : 'Отсутствует',
                inline: true
            })
            .addFields({
                name: 'Теги',
                value: (data.tags && data.tags.length > 0 && data.tags.length > 1)
                    ? `${data.tags[0]}, ${data.tags[1]}`
                    : 'Отсутствуют',
            })
            .setImage(data.image);
    }

    client.on('interactionCreate', (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.isCommand()) {
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
                case 'find-game-by-name':
                    (async () => {
                        try {
                            const gameName = interaction.options.get('game-name').value.toString();

                            await interaction.deferReply();

                            const response = await axios.get(`${process.env.NODE_ENV}/find-game-by-name?name=${encodeURIComponent(gameName)}`);

                            if (response.data !== "AxiosError") {
                                const pages = [];
                                let currentPage = 0;
                                for (let i = 0; i < response.data.length; i++) {
                                    const embed = createEmbedGame(response.data[i]);
                                    pages.push(embed);
                                }

                                const previously = new ButtonBuilder()
                                    .setCustomId('previously')
                                    .setLabel('Назад')
                                    .setStyle(ButtonStyle.Secondary);

                                const next = new ButtonBuilder()
                                    .setCustomId('next')
                                    .setLabel('Вперед')
                                    .setStyle(ButtonStyle.Secondary);

                                const row = new ActionRowBuilder()
                                    .addComponents(previously, next);

                                const message = await interaction.editReply({
                                    embeds: [pages[currentPage].toJSON()],
                                    fetchReply: true,
                                    components: [row]
                                });

                                const collector = message.createMessageComponentCollector({ time: 60000 });

                                collector.on('collect', async i => {
                                    if (i.customId === 'previously') {
                                        currentPage = (currentPage - 1 + pages.length) % pages.length;
                                    } else if (i.customId === 'next') {
                                        currentPage = (currentPage + 1) % pages.length;
                                    }

                                    await i.update({
                                        embeds: [pages[currentPage].toJSON()],
                                        components: [row]
                                    });
                                });
                            }
                            else {
                                interaction.reply('Такой игры не было найдено!');
                                interaction.editReply('Произошла ошибка при обработке запроса');
                            }
                        }
                        catch (error) {
                            console.log(error);
                        }
                    })();
                    break;
            }
        }
        else if (interaction.isButton()) {

        }
    });
}
