const {EmbedBuilder} = require("discord.js");
module.exports = (client) => {
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
        }
    });
}