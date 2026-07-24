const {
    SlashCommandBuilder
} = require("discord.js");

const GameManager = require("../game/GameManager");

module.exports = {

    data: new SlashCommandBuilder()

        .setName("criar-sala")
        .setDescription("Cria uma sala de Uno.")

        .addIntegerOption(option =>
            option
                .setName("jogadores")
                .setDescription("Quantidade máxima de jogadores.")
                .setRequired(true)
                .setMinValue(2)
                .setMaxValue(10)
        )

        .addIntegerOption(option =>
            option
                .setName("cartas")
                .setDescription("Quantidade inicial de cartas.")
                .setRequired(true)
                .addChoices(
                    { name: "7 cartas", value: 7 },
                    { name: "9 cartas", value: 9 }
                )
        ),

    async execute(interaction) {

        await GameManager.create(interaction);

    }

};