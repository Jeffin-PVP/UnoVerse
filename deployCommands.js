require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    REST,
    Routes
} = require("discord.js");

const commands = [];

const commandsPath = path.join(__dirname, "src", "commands");

const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

    const command = require(path.join(commandsPath, file));

    if (!command.data) {

        console.warn(`⚠ ${file} não possui "data".`);
        continue;

    }

    commands.push(command.data.toJSON());

}

const rest = new REST({
    version: "10"
}).setToken(process.env.DISCORD_TOKEN);

(async () => {

    try {

        console.log(`📦 Registrando ${commands.length} comando(s)...`);

        if (process.env.GUILD_ID) {

            await rest.put(

                Routes.applicationGuildCommands(
                    process.env.CLIENT_ID,
                    process.env.GUILD_ID
                ),

                {
                    body: commands
                }

            );

            console.log("✅ Comandos registrados no servidor.");

        } else {

            await rest.put(

                Routes.applicationCommands(
                    process.env.CLIENT_ID
                ),

                {
                    body: commands
                }

            );

            console.log("✅ Comandos registrados globalmente.");

        }

    } catch (error) {

        console.error(error);

    }

})();