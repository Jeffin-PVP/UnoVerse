const { Events, ActivityType } = require("discord.js");

const ApplicationEmojiManager =
    require("../managers/ApplicationEmojiManager");

module.exports = {

    name: Events.ClientReady,

    once: true,

    async execute(client) {

        await ApplicationEmojiManager.load(client);

        console.clear();

        console.log("==============================");
        console.log("🃏 UnoVerse");
        console.log("==============================");
        console.log(`Bot: ${client.user.tag}`);
        console.log(`Servidores: ${client.guilds.cache.size}`);
        console.log(`Emojis da aplicação: ${ApplicationEmojiManager.cache.size}`);

        for (const [name] of ApplicationEmojiManager.cache) {

            console.log(name);

        }

        console.log("==============================");

        client.user.setActivity("🃏 UNO", {

            type: ActivityType.Playing

        });

    }

};