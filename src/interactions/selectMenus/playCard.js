const MatchManager = require("../../game/MatchManager");
const EmbedManager = require("../../game/EmbedManager");

module.exports = async (interaction) => {

    const match = MatchManager.get(interaction.message.id);

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

            content:
                "❌ Você não pode jogar essa carta.",

            ephemeral: true

        });

    }

    await interaction.update({

        content: "✅ Carta jogada!",

        embeds: [

            EmbedManager.match(
                interaction.client,
                match
            )

        ],

        components: []

    });

};