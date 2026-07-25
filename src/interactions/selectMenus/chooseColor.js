const MatchManager = require("../../game/MatchManager");
const EmbedManager = require("../../game/EmbedManager");

module.exports = async (interaction) => {

    const match = MatchManager.get(interaction.channelId);

    if (!match)
        return;

    // Existe um coringa aguardando?
    if (!match.pendingWild) {

        return interaction.reply({

            content: "❌ Nenhum coringa aguardando escolha de cor.",

            ephemeral: true

        });

    }

    // Apenas quem jogou o coringa pode escolher
    if (match.pendingWildPlayer !== interaction.user.id) {

        return interaction.reply({

            content: "❌ Apenas quem jogou o coringa pode escolher a cor.",

            ephemeral: true

        });

    }

    // Cor escolhida
    const color = interaction.values[0];

    match.currentColor = color;

    // Se era +4
    if (match.pendingWildType === "draw4") {

        // Próximo jogador
        match.advanceTurn();

        const target = match.getCurrentPlayer();

        // Compra 4 cartas
        match.drawCards(
            target,
            4
        );

        // Perde o turno
        match.advanceTurn();

    } else {

        // Wild comum
        match.advanceTurn();

    }

    // Limpa o estado do coringa
    match.pendingWild = false;
    match.pendingWildPlayer = null;
    match.pendingWildType = null;

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

    // Fecha a mensagem efêmera do seletor
    await interaction.update({

        content: "✅ Cor escolhida!",

        embeds: [],

        components: []

    });

};