require("dotenv").config();

const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const EventManager = require("./src/managers/EventManager");
const CommandManager = require("./src/managers/CommandManager");

const app = express();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

app.get("/", (req, res) => {
    res.json({
        name: "UnoVerse",
        status: "online",
        bot: client.user?.tag ?? "Starting...",
        guilds: client.guilds.cache.size,
        uptime: process.uptime()
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🌐 Express iniciado na porta ${PORT}`);
});

(async () => {

    await EventManager.load(client);

    await client.login(process.env.DISCORD_TOKEN);

})();