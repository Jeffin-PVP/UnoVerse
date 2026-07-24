const { Events } = require("discord.js");

const CommandManager =
    require("../managers/CommandManager");

const unoLobby =
    require("../interactions/buttons/unoLobby");

const gameButtons =
    require("../interactions/buttons/gameButtons");

const playCard =
    require("../interactions/selectMenus/playCard");

module.exports = {

    name: Events.InteractionCreate,

    async execute(interaction) {

        try {

            // Slash Commands
            if (interaction.isChatInputCommand()) {

                return await CommandManager.execute(interaction);

            }

            // Botões
            if (interaction.isButton()) {

                if (interaction.customId.startsWith("uno_")) {

                    return await unoLobby(interaction);

                }

                if (interaction.customId.startsWith("game_")) {

                    return await gameButtons(interaction);

                }

            }

            // Menus de seleção
            if (interaction.isStringSelectMenu()) {

                if (interaction.customId === "play_card") {

                    return await playCard(interaction);

                }

            }

        } catch (error) {

            console.error(error);

            const reply = {

                content:
                    "❌ Ocorreu um erro ao executar esta interação.",

                ephemeral: true

            };

            if (interaction.replied || interaction.deferred) {

                await interaction.followUp(reply).catch(() => {});

            } else {

                await interaction.reply(reply).catch(() => {});

            }

        }

    }

};