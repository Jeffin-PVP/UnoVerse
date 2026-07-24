const { SlashCommandBuilder } = require("discord.js");

const Deck = require("../game/Deck");
const EmojiManager = require("../managers/EmojiManager");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("mao")
        .setDescription("Mostra uma mão de teste do UnoVerse."),

    async execute(interaction) {

        const deck = new Deck();

        const hand = [];

        for (let i = 0; i < 7; i++) {

            hand.push(
                deck.draw()
            );

        }

        const emojis = hand.map(card =>
            EmojiManager.card(
                interaction.client,
                card
            )
        );

        await interaction.reply({

            content:
`# 🎴 Sua mão de teste

${emojis.join(" ")}`

        });

    }

};