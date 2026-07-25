const MatchManager = require("../../game/MatchManager");
const EmbedManager = require("../../game/EmbedManager");

module.exports = async (interaction) => {

    const match = MatchManager.get(interaction.channelId);

    if (!match)
        return;

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

    const index = Number(
        interaction.values[0]
    );

    const played = match.playCard(
        player,
        index
    );

    if (!played) {

        return interaction.reply({

            content: "❌ Você não pode jogar essa carta.",

            ephemeral: true

        });

    }

    // Se for Wild ou +4
    if (
        played === "choose_color" ||
        played === "choose_color_draw4"
    ) {

        const {
            ActionRowBuilder,
            StringSelectMenuBuilder
        } = require("discord.js");

        const menu = new StringSelectMenuBuilder()

            .setCustomId("choose_color")

            .setPlaceholder("🌈 Escolha uma cor")

            .addOptions([

                {
                    label: "Vermelho",
                    value: "red",
                    emoji: "🔴"
                },

                {
                    label: "Amarelo",
                    value: "yel",
                    emoji: "🟡"
                },

                {
                    label: "Verde",
                    value: "grn",
                    emoji: "🟢"
                },

                {
                    label: "Azul",
                    value: "blu",
                    emoji: "🔵"
                }

            ]);

        return interaction.update({

            content: "🌈 Escolha a nova cor.",

            components: [

                new ActionRowBuilder()

                    .addComponents(menu)

            ]

        });

    }

    // Atualiza a mensagem pública da partida
    await match.message.edit({

        embeds: [

            EmbedManager.match(
                interaction.client,
                match
            )

        ],

        components: match.message.components

    });

    // Fecha o menu do jogador
    await interaction.update({

        content: "✅ Carta jogada!",

        components: []

    });

};