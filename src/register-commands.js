require('dotenv').config();
const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');

const commands = [
    {
        name: 'add',
        description: 'Sum two numbers',
        options: [
            {
                name: 'first-number',
                description: 'The first number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
            {
                name: 'second-number',
                description: 'The second number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
        ]
    },
    {
        name: 'embed',
        description: 'Sends an embed',
    },
    {
        name: 'get-lucky',
        description: 'Отправить случайную игру',
    },
    {
        name: 'video',
        description: 'Отправить любое видео из доступных боту',
    },
    {
        name: 'add-video',
        description: 'Команда добавит боту любое видео, которое он будет отправлять в чат',
        options: [
            {
                name: 'link-to-video',
                description: 'Ссылка на видео, которое ты хочешь отправить',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ]
    },
];

const rest = new REST({ version: '10'}).setToken(process.env.DISCORD_TOKEN);

module.exports = () => {
    (async () => {
        try {
            console.log('Registering slash commands');

            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                {body: commands }
            )

            return console.log('Slash commands was registered');
        } catch (error) {
            console.error(error);
        }
    })();
}
