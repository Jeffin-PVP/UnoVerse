const { SlashCommandBuilder } = require("discord.js");

const Deck = require("../game/Deck");
const EmojiManager = require("../managers/EmojiManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("deck")
        .setDescription("Testa o baralho."),

    async execute(interaction) {

        const deck = new Deck();

        const card = deck.draw();
        const emoji = EmojiManager.getCard(interaction.client, card);

        await interaction.reply({
            content:
`🃏 Baralho criado!

Cartas restantes: ${deck.remaining()}

Primeira carta:
${emoji}`
        });

    }
};