require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActivityType } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on("ready", (c) => {
    console.log(`${c.user.tag} is ready`);

    client.user.setActivity({
        name: 'etherite',
        type: ActivityType.Streaming,
        url: 'https://www.youtube.com/watch?v=ugONnJsdD-8&ab_channel=BoSinnEdits',
    });
});

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
})


client.login(process.env.DISCORD_TOKEN);