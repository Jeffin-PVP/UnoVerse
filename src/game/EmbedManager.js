const { EmbedBuilder } = require("discord.js");

const EmojiManager = require("../managers/EmojiManager");

class EmbedManager {

    static lobby(game) {

        const players = game.players
            .map((player, index) => {

                const icon =
                    index === 0 ? "👑" : "🎮";

                return `${icon} <@${player.id}>`;

            })
            .join("\n");

        return new EmbedBuilder()

            .setColor(0xFFD43B)

            .setTitle("🃏 Sala do UnoVerse")

            .setDescription(
`${players}

══════════════════════

👥 **Jogadores**
${game.players.length}/${game.maxPlayers}

🃏 **Cartas Iniciais**
${game.initialCards}

⏳ Aguardando jogadores...`
            )

            .setFooter({

                text: "UnoVerse"

            });

    }

    static match(client, match) {

        const tableCard = EmojiManager.card(
            client,
            match.currentCard
        );

        const back = EmojiManager.back(client);

        const colors = {

            red: "🟥 Vermelho",
            blu: "🟦 Azul",
            grn: "🟩 Verde",
            yel: "🟨 Amarelo",
            wild: "⬛ Coringa"

        };

        const players = match.players

            .map((player, index) => {

                const turn =
                    index === match.currentPlayer
                        ? "➡️"
                        : " ";

                const crown =
                    player.id === match.host
                        ? "👑"
                        : "🎮";

                return `${turn} ${crown} <@${player.id}>  ${back} ×${player.cardCount()}`;

            })

            .join("\n");

        return new EmbedBuilder()

            .setColor(0xFFD43B)

            .setTitle("🃏 UnoVerse")

            .setDescription(
`# Carta da Mesa

${tableCard}

**Cor Atual**
${colors[match.currentColor]}

══════════════════════

${players}

══════════════════════

📦 **Baralho:** ${match.deck.cards.length}

🗑️ **Descarte:** ${match.discard.length}`
            )

            .setFooter({

                text: `Turno de ${match.getCurrentPlayer().username}`

            });

    }

}

module.exports = EmbedManager;