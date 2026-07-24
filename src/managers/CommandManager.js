const fs = require("fs");
const path = require("path");

const commands = {};

const commandsPath = path.join(__dirname, "../commands");

const files = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

for (const file of files) {

    const command = require(path.join(commandsPath, file));

    commands[command.data.name] = command;

}

class CommandManager {

    static async execute(interaction) {

        const command = commands[interaction.commandName];

        if (!command)
            return;

        await command.execute(interaction);

    }

}

module.exports = CommandManager;