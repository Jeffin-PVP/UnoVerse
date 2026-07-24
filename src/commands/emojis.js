const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("emojis")
        .setDescription("Mostra todos os emojis do UnoVerse."),

    async execute(interaction) {

        const emojis = interaction.client.application.emojis.cache;

        if (!emojis.size) {
            return interaction.reply({
                content: "❌ Nenhum emoji encontrado.",
                ephemeral: true
            });
        }

        const lista = emojis
            .map(emoji => `${emoji} • \`${emoji.name}\``)
            .join("\n");

        await interaction.reply({
            content: lista
        });

    }
};