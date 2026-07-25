const MatchManager = require("../../game/MatchManager");
const EmbedManager = require("../../game/EmbedManager");

module.exports = async (interaction) => {

    const match = MatchManager.get(
        interaction.message.id
    );

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

    // Apenas quem jogou o Wild pode escolher a cor
    if (match.getCurrentPlayer().id !== interaction.user.id) {

        return interaction.reply({

            content: "❌ Apenas o jogador da vez pode escolher a cor.",

            ephemeral: true

        });

    }

    const color = interaction.values[0];

    // Atualiza a cor da mesa
    match.currentColor = color;

    // Se a carta for +4
    if (match.currentCard.value === "draw4") {

        // Próximo jogador
        match.advanceTurn();

        const target =
            match.getCurrentPlayer();

        // Compra quatro cartas
        target.drawMany(
            match.deck,
            4
        );

        // Perde o turno
        match.advanceTurn();

    } else {

        // Wild comum
        match.advanceTurn();

    }

    await interaction.update({

        content: "🌈 Cor escolhida!",

        embeds: [

            EmbedManager.match(
                interaction.client,
                match
            )

        ],

        components: interaction.message.components

    });

};