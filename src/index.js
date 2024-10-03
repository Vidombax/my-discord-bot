require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActivityType, Partials} = require('discord.js');
const ready = require('./handlers/ready.js');
const commands = require('./commands/commands.js');
const registerCommands = require('./register-commands.js');
const db = require('./handlers/db.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
    partials: [Partials.Channel],
});

if (process.env.TEST_MODE === 'ON') {
    (async () => {
        try {
            await db;
            registerCommands();
            ready(client);
            commands(client);

            client.login(process.env.DISCORD_TOKEN);
        }
        catch (error) {
            console.log(error);
        }
    })();
}