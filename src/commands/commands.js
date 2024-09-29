const {EmbedBuilder} = require("discord.js");
const axios = require("axios");
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
                addVideoLink(interaction.user.id, link);
                interaction.reply('Видео было добавлено!');
                break;
        }
    });
}
