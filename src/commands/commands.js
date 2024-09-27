const {EmbedBuilder} = require("discord.js");
const axios = require("axios");
module.exports = (client) => {
    const addVideoLink = async (idUser, link) => {
        try {
            const response = await axios.post('/video', {
                idUser: idUser,
                link: link,
            });
            console.log(`link ${response.data.link} was added`);
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
                break;
            case 'add-video':
                const link = interaction.options.get('link-to-video').value;
                const idUser = 1;
                addVideoLink(idUser, link);
                console.log(interaction);
                break;
        }
    });
}
