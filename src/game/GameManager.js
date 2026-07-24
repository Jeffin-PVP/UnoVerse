const UnoGame = require("./UnoGame");

class GameManager {

    static games = new Map();

    static async create(interaction) {

        // Verifica se já existe uma sala neste canal
        const exists = [...this.games.values()]
            .find(game => game.channelId === interaction.channel.id);

        if (exists) {

            return interaction.reply({

                content: "❌ Já existe uma sala neste canal.",

                ephemeral: true

            });

        }

        const game = new UnoGame(

            interaction.user,

            interaction.options.getInteger("jogadores"),

            interaction.options.getInteger("cartas")

        );

        const message = await interaction.reply({

            embeds: [
                game.createEmbed()
            ],

            components:
                game.createButtons(),

            fetchReply: true

        });

        game.message = message;
        game.channelId = interaction.channel.id;

        this.games.set(
            message.id,
            game
        );

    }

    static get(messageId) {

        return this.games.get(messageId);

    }

    static delete(messageId) {

        this.games.delete(messageId);

    }

}

module.exports = GameManager;