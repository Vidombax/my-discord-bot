const {ActivityType} = require("discord.js");
const axios = require("axios");
const cron = require("node-cron");

async function fetchVideoLink(){
    try {
        if (process.env.TEST_MODE === "ON") {
            const response = await axios.get("http:/localhost:3000/video");
            return response.data.link;
        }
    }
    catch(error)
    {
        console.log(error);
    }
}

module.exports = (client) => {
    client.on("ready", (c) => {
        setTimeout(() => {
            console.log('database connection is ready');
            console.log(`${c.user.tag} is ready`);

            c.user.setActivity({
                name: 'bo sinn rompompom',
                type: ActivityType.Streaming,
                url: 'https://www.youtube.com/watch?v=ugONnJsdD-8&ab_channel=BoSinnEdits',
            });
        }, 1000);

        cron.schedule('0 */10 * * * *', async () => {
            try {
                const channel = await client.channels.fetch(process.env.CHANNEL_ID);

                if (!channel) {
                    return console.log("Channel not found");
                }

                if (process.env.TEST_MODE === "ON") {
                    const response = await axios.get("http:/localhost:3000/video");
                    channel.send(response.data.link);
                }
            }
            catch(error) {
                console.log(error);
            }
        });
    });
}