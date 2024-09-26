const {ActivityType} = require("discord.js");
module.exports = (client) => {
    client.on("ready", (c) => {
        setTimeout(() => {
            console.log(`${c.user.tag} is ready`);

            client.user.setActivity({
                name: 'etherite',
                type: ActivityType.Streaming,
                url: 'https://www.youtube.com/watch?v=ugONnJsdD-8&ab_channel=BoSinnEdits',
            });
        }, 1000)
    });
}