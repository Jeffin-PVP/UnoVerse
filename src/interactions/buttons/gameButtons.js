const {
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const MatchManager = require("../../game/MatchManager");
const EmbedManager = require("../../game/EmbedManager");
const EmojiManager = require("../../managers/EmojiManager");

module.exports = async (interaction) => {

    const match = MatchManager.get(interaction.channelId);

    // Não é uma partida
    if (!match)
        return;

    switch (interaction.customId) {

        case "game_hand": {

            const player = match.players.find(
                player => player.id === interaction.user.id
            );

            if (!player) {

                return interaction.reply({

                    content: "❌ Você não faz parte desta partida.",

                    ephemeral: true

                });

            }

            const hand = player.hand
                .map(card =>
                    EmojiManager.card(
                        interaction.client,
                        card
                    )
                )
                .join(" ");

            await interaction.reply({

                content:
                    `# 🎴 Sua mão

${hand || "Nenhuma carta."}`,

                ephemeral: true

            });

            break;

        }

        case "game_play": {

            const player = match.players.find(
                player => player.id === interaction.user.id
            );

            if (!player) {

                return interaction.reply({

                    content: "❌ Você não faz parte desta partida.",

                    ephemeral: true

                });

            }

            if (match.getCurrentPlayer().id !== interaction.user.id) {

                return interaction.reply({

                    content: "❌ Não é o seu turno.",

                    ephemeral: true

                });

            }

            const menu = new StringSelectMenuBuilder()

                .setCustomId("play_card")

                .setPlaceholder("Escolha uma carta...")

                .addOptions(

                    player.hand.map((card, index) => ({

                        label: `${card.color.toUpperCase()} ${card.value}`,

                        description: "Jogar esta carta",

                        value: String(index),

                        emoji: EmojiManager.cardMenu(
                            interaction.client,
                            card
                        )

                    }))

                );

            const row = new ActionRowBuilder()

                .addComponents(menu);

            await interaction.reply({

                content: "🎮 Escolha a carta que deseja jogar:",

                components: [row],

                ephemeral: true

            });

            break;

        }

        case "game_draw": {

            const current = match.getCurrentPlayer();

            if (interaction.user.id !== current.id) {

                return interaction.reply({

                    content: "❌ Não é o seu turno.",

                    ephemeral: true

                });

            }

            match.drawCard(current);

            match.nextTurn();

            await interaction.update({

                embeds: [

                    EmbedManager.match(
                        interaction.client,
                        match
                    )

                ]

            });

            break;

        }

        case "game_uno": {

            const player = match.players.find(
                player => player.id === interaction.user.id
            );

            if (!player) {

                return interaction.reply({

                    content: "❌ Você não faz parte desta partida.",

                    ephemeral: true

                });

            }

            if (player.hand.length !== 1) {

                return interaction.reply({

                    content: "❌ Você só pode dizer UNO quando tiver apenas 1 carta.",

                    ephemeral: true

                });

            }

            await interaction.reply({

                content: `📢 ${interaction.user} gritou **UNO!**`

            });

            break;

        }

    }

};